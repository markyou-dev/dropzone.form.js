/**
 * form submit 시 dropzone 으로 이미지를 업로드할 수 있는 기능
 */
$dropzoneForm = (function () {
    // 기본설정
    Dropzone.autoDiscover = false;

    // form 설정
    var _form = {
        el: null, // form Element
        action_url: null, // form action url
        submit_btn: null, // form submit button
    };

    // callback 함수설정
    var _callback = {
        getParams: function (el) { // getList 파라미터 설정

        },
        getList: function (myDropzone) { // getList 출력부분

        },
        beforeSubmit: function (e, _form, formData) {  // submit 요청전 동작

        },
        afterSubmit: function (e, _form, response) {  // submit 동작후 동작 (성공시에만)

        },
    };

    // dropzone 설정
    var _dropzones = [];
    var _deleteFileIds = []; // 삭제할 파일 id 배열
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
        dictDefaultMessage: '업로드할 이미지를 드래그해서 올려주세요.',
        dictFileTooBig: '파일용량 초과 10MB 이하로 다시 업로드하세요',
        dictRemoveFile: '<i class="fa fa-remove"></i>',
        acceptedFiles: 'image/*',
        init: function (o) {
            var myDropzone = this; // closure
            var params = myDropzone.options.params;
            var paramName = myDropzone.options.paramName;

            // id가 있는 경우만
            if (params && paramName) {
                _callback.getList(myDropzone);
            }
        },
        removedfile: function (file) { // 삭제
            event.preventDefault();
            var id = file.id;
            if (id) { // 파일삭제 대기 (submit 시에 삭제됨)
                file.previewElement.remove();
                _deleteFileIds.push(file.id);
            } else { // 기본파일 삭제
                file.previewElement.remove();
            }
        },
    };

    // action
    var _action = {
        serialize: function () { // form data 직렬화 (이미지 포함)
            var formData = new FormData(_form.el[0]);

            // 추가할 파일 오프젝트 append
            _dropzones.forEach(dropzone => {
                dropzone.files.forEach((file, i) => {
                    formData.append(dropzone.options.paramName + '[' + i + ']', file);
                });
            });

            // 삭제될 파일 id append
            if (_deleteFileIds.length > 0) {
                $.each(_deleteFileIds, function (i, fileId) {
                    formData.append('deleteFileIds[' + i + ']', fileId);
                });
            }

            return formData;
        },
        submit: function (e) {
            // 파라미터 직렬화
            var formData = _action.serialize();

            // submit 전 동작
            var beforeAction = _callback.beforeSubmit(e, _form, formData);
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
                    // submit 후 동작
                    _callback.afterSubmit(e, _form, response);
                },
                error: function (err) {
                    alert('에러메시지 : ' + err);
                }
            });
        }
    };

    // 이벤트 핸들러 연결
    var _addEventHandlers = function () {
        // form submit
        _form.el.find('input[type=submit]').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            _action.submit(e);
        });
    };

    return {
        init: function (formEl, dropzoneEl, callback) { // 초기화 (필수)
            // 파라미터 체크
            if (!$(formEl)) {
                alert('초기화된 form 이 없습니다.');
                return false;
            }

            // form setting
            _form.el = $(formEl);
            _form.action_url = $(formEl).attr('action');
            _form.submit_btn = $(formEl).find('input[type=submit]');

            // action url 설정
            _config.url = _form.action_url;

            // 콜백함수 지정 (요청전)
            if (callback.beforeSubmit) {
                _callback.beforeSubmit = callback.beforeSubmit;
            }

            // 콜백함수 지정 (요청후)
            if (callback.afterSubmit) {
                _callback.afterSubmit = callback.afterSubmit;
            }

            // 콜백함수 지정 (파라미터 지정)
            if (callback.getParams) {
                _callback.getParams = callback.getParams;
            }

            // 콜백함수 지정 (dropzone 목록을 초기화)
            if (callback.getList) {
                _callback.getList = callback.getList;
            }

            // dropzone 생성
            _form.el.find(dropzoneEl).each(function (i, el) {
                _config.paramName = $(el).attr('name'); // 파일 파라미터 명
                _config.params = _callback.getParams(el);
                _dropzones.push(new Dropzone(el, _config));
            });

            // event handler 연결
            _addEventHandlers();
        }
    }
})();
