/**
 * dropzone 을 사용하여 올린이미지를, form 으로 넘길수 있는 플러그인
 */
$dropzoneForm = (function () {
    // form 설정
    var _this = null; // form Element
    var _ui = {  // form ui
        submit_btn: null,
    };
    var _action_url = null; // form action url
    var _formdata = null; // form data

    // dropzone 설정
    Dropzone.autoDiscover = false;
    var _dzList = [];
    var _deleteFileIds = []; // 삭제할 파일 id 배열
    var _dzOption = {
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
            _callbacks.getList(this);
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

    // dropzone form 초기화
    var init = function (fId, dzId, callbacks, dzOption) {
        // 필수 라이브러리 체크
        if (typeof $ == 'undefined') {
            console.log("초기화실패 : jquery 가 없습니다.");
            return false;
        }
        if ($().jquery < '3.1.1') {
            console.warn('jquery 버전이 너무 낮아 안전하지 않습니다. (권장 : >= 3.1.1)');
            // return false;
        }
        if (typeof Dropzone == 'undefined') {
            console.log("초기화실패 : dropzone 이 없습니다.");
            return false;
        }

        // form 설정
        _this = $(fId);
        _action_url = _this.attr('action') ? _this.attr('action') : window.location.pathname;
        _ui.submit_btn = _this.find('input[type=submit]');

        // 필수 데이터 체크
        if (!_this) {
            alert('선택된 form 이 없습니다.');
            return false;
        }
        if (!_action_url) {
            alert('action url 이 없습니다.');
            return false;
        }
        if (!_ui.submit_btn) {
            alert('submit 버튼이 없습니다.');
            return false;
        }

        // callback 설정
        $.extend(_callbacks, callbacks);

        // dropzone 설정
        setDropzone(dzId, dzOption);

        // event handler 연결
        setEventHandler();
    };

    // callback 함수설정
    var _callbacks = {
        getList: function (dz) { // getList 출력부분
        },
        beforeSubmit: function (f, ui, formdata) {  // submit 요청전 동작
        },
        afterSubmit: function (f, ui, response) {  // submit 동작후 동작 (성공시에만)
        },
    };

    // form data 직렬화 (이미지 포함)
    var serialize = function () {
        var formdata = new FormData(_this[0]);

        // dropzone 파일 오브젝트 append
        _dzList.forEach(dz => {
            dz.files.forEach((file, i) => {
                formdata.append(dz.options.paramName + '[' + i + ']', file);
            });
        });

        // 삭제할 파일 id append
        if (_deleteFileIds.length > 0) {
            $.each(_deleteFileIds, function (i, fileId) {
                formdata.append('deleteFileIds[' + i + ']', fileId);
            });
        }

        _formdata = formdata;
    };

    // form submit
    var submit = function () {
        // 파라미터 직렬화
        serialize();

        // submit 전 콜백
        if (_callbacks.beforeSubmit(_this, _ui, _formdata) !== false) {
            // 비동기 submit
            $.ajax({
                url: _action_url,
                method: 'post',
                data: _formdata,
                dataType: 'json',
                processData: false,
                contentType: false,
                success: function (response) {
                    // submit 후 콜백
                    _callbacks.afterSubmit(_this, _ui, response);
                },
                error: function (err) {
                    alert('에러메시지 : ' + err);
                }
            });
        }
    };

    // dropzone 설정
    var setDropzone = function (dzId, dzOption) {
        _dzOption.url = _action_url; // url 설정
        $.extend(_dzOption, dzOption); // 추가옵션 병합

        _this.find(dzId).each(function (i, dzElement) {
            var paramName = $(dzElement).attr('name'); // 파일 name 속성
            if (paramName) {
                _dzOption.paramName = paramName;
                _dzList.push(new Dropzone(dzElement, _dzOption));
            }
        });
    };

    // event handler 설정
    var setEventHandler = function () {
        _ui.submit_btn.on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            submit();
        });
    };

    return {
        init: init
    }
})();
