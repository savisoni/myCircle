
$(document).ready(function () {
    $("#myPost").validate({
        rules: {
            title: {
                maxlength: 30
            },
            description: {

                maxlength: 300
            }
        },
        messages: {
            title: {
                maxlength: "please enter characters less than 30"
            },
            description: {
                maxlength: "please add description within 300 characters"
            }
        },
        submitHandler: function (form) {
            console.log(form);
            $("#post-btn").click(function (e) {
               
                console.log($("#image")[0].files[0]);
                let title = $("#title").val();
                let description = $("#desc").val();
                let image = $("#image")[0].files[0];
                let formData = new FormData();

                formData.append('title', title);
                formData.append('description', description);
                formData.append('post-img', image);



                console.log(formData)
                e.preventDefault();
                $.ajax({
                    url: "/timeline",
                    type: "POST",
                    async: false,
                    cache: false,
                    contentType: false,
                    data: formData,
                    processData: false,
                    success: function (response) {
                        window.location.href = "/timeline"
                    },
                    error: function (err) {
                        console.log(err);
                    }
                })
            })
        }
    })






})
