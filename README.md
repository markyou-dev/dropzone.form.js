# dropzone.form.js

* form 안에 입력값들과 dropzone 드래그한 파일들을 한꺼번에 submit 할 수 있는 기능
* 사용할 form 을 지정해주고, dropzone 요소들을 클래스로 구분한다.
* 여러개의 dropzone 이 사용가능하다. (단, 파라미터와 callback 부분이 동일한 규칙을 가져야함)
* 삭제할 파일들도 파라미터로 넘겨준다. (단, init시 id를 지정해줘야함)

<주의>
* 이미지파일만 가능합니다.
* 현재 버전은 IE를 지원하지 않습니다.

## 필수 요구사항 (Requirement)

jquery (버전 관계없음 : 최신버전 권장):

    <script src="https://code.jquery.com/jquery-2.2.4.min.js" crossorigin="anonymous"></script>

dropzone.js (5.7.0 version):

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.7.0/basic.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.7.0/dropzone.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.7.0/dropzone.min.js"></script>
    
## 사용방법 (How to use it)

##### 1. 필수 라이브러리들을 불러옵니다.

    <script src="https://code.jquery.com/jquery-2.2.4.min.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.7.0/basic.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.7.0/dropzone.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.7.0/dropzone.min.js"></script>

##### 2. submit 할 form 과, dropzone을 사용할 엘리먼트들을 지정해줍니다.

    <!-- form -->
    <form id="form1" method="post" action="./ajax.php"
            enctype="multipart/form-data">
        <!-- body -->
        <div id="body">
            <div>
                [slide1]
                <div class="dropzone" name="slide1"></div>

            </div>
            <div>
                [slide2]
                <div class="dropzone" name="slide2"></div>
            </div>
        </div>
        <!-- ./body -->

        <!-- footer -->
        <div id="footer">
            <label>
                name :
                <input type="text" name="name" placeholder="" />
            </label>
            <label>
                phone :
                <input type="text" name="hp" placeholder="" />
            </label>

            <input type="hidden" name="act" value="submit">
            <input type="submit" value="submit">
        </div>
        <!-- ./footer -->
    </form>
    <!-- ./form -->
    
## 예제

    // dropzone form init
    $dropzoneForm.init("#form1", ".dropzone", {
        getParams: function (el) { // 파라미터 지정 (getList 사용시)
            return {
                act: 'getList',
                name: $(el).data('name'),
            };
        },
        getList: function (myDropzone) { // 이미 등록된 파일리스트를 바인딩시킴
            var params = myDropzone.options.params;
            var paramName = myDropzone.options.paramName;
            var url = myDropzone.options.url;

            // list request
            $.ajax({
                url: url,
                method: 'post',
                data: params,
                dataType: 'json',
                success: function (response) {
                    var list = response;
                    if (list) {
                        $.each(list, function (idx, item) {
                            var filepath = item.src;
                            var mockFile = {
                                id: item.id,
                                name: paramName,
                            };
                            myDropzone.emit("addedfile", mockFile);
                            myDropzone.emit("thumbnail", mockFile, filepath);
                            myDropzone.emit("complete", mockFile);
                        });
                    }
                },
                error: function (err) {
                    alert('error  : ' + err);
                }
            });
        },
        beforeSubmit: function (e, _form, _formData) { // submit 전 동작
            if (!confirm('before Submit Action!')) {
                return false;
            }
        },
        afterSubmit: function (e, _form, response) { // submit 후 동작
            console.log(response);
            return false;
        }
    });


## 기타

## Changelog:

2022-02-23
* init
* Readme 작성

2022-09-21
* 수정
