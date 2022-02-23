/**
 * form submit 시 dropzone 으로 이미지를 업로드할 수 있는 기능
 */
$dropzoneForm = (function () {
    // default config
    Dropzone.autoDiscover = false;

    // form config
    var _form = {
        el: null, // form Element
        action_url: null, // form action url
        submit_btn: null, // form submit button
    };

    // allow add config
    var _addAllowConfig = [
        'dictRemoveFile',
        'dictDefaultMessage',
    ];

    // callback
    var _callback = {
        beforeSubmit: function (_form, _submitData) { // submit before action

        },
        afterSubmit: function (_form, response) { // submit after action

        },
        getParams: function (el) { // // get Param init

        },
        getList: function (myDropzone) { // get List print

        },
    };

    // dropzone
    var _dropzones = [];
    var _deleteFileIds = []; // delete File Ids
    var _config = {
        url: null,
        params: null,
        paramName: null,
        parallelUploads: 10,
        maxFilesize: 10,
        maxFiles: 99,
        clickable: false,
        uploadMultiple: true,
        autoProcessQueue: false,
        addRemoveLinks: true,
        acceptedFiles: 'image/*',
        dictFileTooBig: '파일용량 초과 10MB 이하로 다시 업로드하세요',
        init: function (o) {
            var myDropzone = this; // closure
            var params = myDropzone.options.params;
            var paramName = myDropzone.options.paramName;

            if (params && paramName) {
                _callback.getList(myDropzone);
            }
        },
        removedfile: function (file) { // remove
            event.preventDefault();
            var id = file.id;
            if (id) { // file id
                file.previewElement.remove();
                _deleteFileIds.push(file.id);
            } else { // default
                file.previewElement.remove();
            }
        },
    };

    // action
    var _action = {
        serialize: function () { // form data serialize
            var formData = new FormData(_form.el[0]);

            // file append
            _dropzones.forEach(dropzone => {
                dropzone.files.forEach((file, i) => {
                    formData.append(dropzone.options.paramName + '[' + i + ']', file);
                });
            });

            // remove file id append
            if (_deleteFileIds.length > 0) {
                $.each(_deleteFileIds, function (i, fileId) {
                    formData.append('deleteFileIds[' + i + ']', fileId);
                });
            }

            return formData;
        },
        submit: function (e) {
            // serialize
            var formData = _action.serialize();

            // submit Data
            var _submitData = {
                formData: formData,
            };

            // submit before action
            var beforeAction = _callback.beforeSubmit(_form, _submitData);
            if (beforeAction === false) {
                return false;
            }

            // submit
            $.ajax({
                url: _form.action_url,
                method: 'post',
                data: formData,
                dataType: 'json',
                processData: false,
                contentType: false,
                success: function (response) {
                    // submit after action
                    _callback.afterSubmit(_form, response);
                },
                error: function (err) {
                    alert('error : ' + err);
                }
            });
        }
    };

    // event handler
    var _addEventHandlers = function () {
        // form submit
        _form.el.find('input[type=submit]').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            _action.submit(e);
        });
    };

    return {
        init: function (formEl, dropzoneEl, callback, addConfig) { // init (requirement)
            // requirement param check
            if (!$(formEl)) {
                alert('There is no initialized form!');
                return false;
            }

            // form setting
            _form.el = $(formEl);
            _form.action_url = $(formEl).attr('action');
            _form.submit_btn = $(formEl).find('input[type=submit]');

            // action url
            _config.url = _form.action_url;

            if (callback) {
                // callback (request before)
                if (callback.beforeSubmit) {
                    _callback.beforeSubmit = callback.beforeSubmit;
                }

                // callback (request after)
                if (callback.afterSubmit) {
                    _callback.afterSubmit = callback.afterSubmit;
                }

                // callback (params)
                if (callback.getParams) {
                    _callback.getParams = callback.getParams;
                }

                // callback (get list)
                if (callback.getList) {
                    _callback.getList = callback.getList;
                }
            }

            // added config
            if (addConfig) {
                _addAllowConfig.forEach(item => {
                    if (addConfig[item]) {
                        _config[item] = addConfig[item];
                    }
                });
            }

            // dropzone create
            _form.el.find(dropzoneEl).each(function (i, el) {
                _config.paramName = $(el).data('name'); // file name
                _config.params = _callback.getParams(el); // get param
                _dropzones.push(new Dropzone(el, _config));
            });

            // event handler bind
            _addEventHandlers();
        }
    }
})();