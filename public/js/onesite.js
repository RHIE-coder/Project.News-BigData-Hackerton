console.log("JS 파일 로드 완료")

const summernote_setting = {
    height: 600,
    minHeight: null,
    maxHeight: null,
    focus: true, // set focus to editable area after initializing summernote
    lang: 'ko-KR',

    //콜백 함수
    callbacks: {
        onImageUpload: function (files, editor, welEditable) {
            for (var i = files.length - 1; i >= 0; i--) { // 다중 업로드 처리
                uploadSummernoteImageFile(files[i], this);
            }
        }
    }
};

$('#summernote').summernote(summernote_setting);


function uploadSummernoteImageFile(file, el) {
    data = new FormData();
    data.append("editor_uploaded_file", file);
    $.ajax({
        data: data,
        type: "POST",
        url: "/coupang/editor/fileupload",
        contentType: false,
        enctype: 'multipart/form-data',
        processData: false,
        success: function (url) {
            $(el).summernote('editor.insertImage', url);
        }
    });
}


function addElements(of, items) {

    let stack = [];

    for (const property in items) {
        const div_element = document.createElement("div")
        const span_element = document.createElement("span")
        div_element.innerText = `${property}:::`
        span_element.style = "color:yellow;background-color:red"
        span_element.id = `${property}`
        span_element.innerText = items[property]
        stack.push(span_element)
        stack.push(div_element)
    }

    of.after("<br><br>")

    while (stack.length !== 0) {
        const divElement = stack.pop();
        divElement.append(stack.pop())
        of.after(divElement)
    }

    stack = null;
}

$(document).on('click', '#outboundBtn', function () {
    console.log("dou")
    $.ajax({
        url: '/coupang/qry/outbound',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            console.log(`POST : /coupang/qry/outbound`)
            $('#outbound-result').text(JSON.stringify(data, null, 2))

            addElements($('#outbound-result'), {
                deliveryCode: data.content[0].remoteInfos[0].deliveryCode,
                outboundShippingPlaceCode: data.content[0][`outboundShippingPlaceCode`]
            })

            console.log(`SUCCESS`)
        }
    })
})

$(document).on('click', '#rscBtn', function () {
    $.ajax({
        url: '/coupang/qry/rsc',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            console.log(`POST : /coupang/qry/rsc`)
            $('#rsc-result').text(JSON.stringify(data, null, 2))

            addElements($('#rsc-result'), {
                returnCenterCode: data.data.content[0].returnCenterCode,
                returnChargeName: data.data.content[0].shippingPlaceName,
                companyContactNumber: data.data.content[0].placeAddresses[0].companyContactNumber,
                returnZipCode: data.data.content[0].placeAddresses[0].returnZipCode,
                returnAddress: data.data.content[0].placeAddresses[0].returnAddress,
                returnAddressDetail: data.data.content[0].placeAddresses[0].returnAddressDetail,
            })

            console.log(`SUCCESS`)
        }
    })
})

$(document).on('click', '#catepredBtn', function () {
    const productName = $('#productName').val();
    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: '/coupang/qry/catepred',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({ productName }),
        success: function (data) {
            console.log(`POST : /coupang/qry/catepred`)
            $('#catepred-result').text(JSON.stringify(data, null, 2))
            
            addElements($('#catepred-result'),{
                displayCategoryCode: data.data.predictedCategoryId
            })

            console.log(`SUCCESS`)
        }
    })
})


$(document).on('click', '#catemetaBtn', function () {
    const catepredResult = JSON.parse($('#catepred-result').text());
    const displayCategoryCode = catepredResult.data.predictedCategoryId;


    $.ajax({
        contentType: "application/json; charset=utf-8",
        url: '/coupang/qry/catemeta',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({ displayCategoryCode }),
        success: function (data) {
            $('#catemeta-result').text(JSON.stringify(data, null, 2))

            //notice 처리 부분
            let queue = [];

            const noticeCategory = data.data.noticeCategories[0]
            const noticeCategoryName = noticeCategory.noticeCategoryName

            noticeCategory.noticeCategoryDetailNames?.forEach(element=>{
                queue.push({
                    noticeCategoryName : noticeCategoryName,
                    noticeCategoryDetailName : element.noticeCategoryDetailName,
                    content: "상세페이지 참조"
                })
            })

            const pre_element = document.createElement("pre")
            pre_element.setAttribute("id", "notices");
            
            pre_element.innerText = JSON.stringify(queue, null, 2)
            $('#catemeta-result').after(pre_element)


            queue = null

            

            //  Attribute 처리 부분

            const attributes = data.data.attributes //array

            let stack = []

            attributes.forEach(element => {
                const label_element = document.createElement('label');
                label_element.setAttribute('class','attributeTypeName')
                let content = [`${element.attributeTypeName} [${element.dataType}]`]
                attributes.usableUnits?.forEach(unit=>{
                    content.push(unit)
                })
                label_element.innerText = content.join(":::")
                const input_element = document.createElement('input');
                input_element.setAttribute('type','text')
                input_element.setAttribute('class',`attributeValueName`)
                input_element.setAttribute('size','55')

                stack.push(input_element)
                stack.push(label_element)
            });

            while (stack.length !== 0) {
                const labelElement = stack.pop();
                labelElement.append(stack.pop())
                $('#catemeta-result').after(labelElement)
            }
        
            stack = null;

        }
    })
})


$(document).on('click', '#createprodBtn', function () {
    
    
    const data = $('#editorFormData')[0];
    const formData = new FormData(data)
    formData.append('sellerProductName',$('#sellerProductName').val())
    for(let i of formData.keys()){
        console.log(i)
    }
    


    $.ajax({
        contentType: false,
        processData: false, //TEST
        url: '/coupang/create/product',
        type: 'POST',
        enctype: 'multipart/form-data',
        data: formData,
        success: function (data) {
            $('#createprod-result').text(JSON.stringify(data, null, 2))


            console.log($('#createprod-result').text())
        }
    })
})