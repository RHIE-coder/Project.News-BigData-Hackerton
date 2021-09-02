const express = require('express');
const router = express.Router();
const path = require('path')
const coupangAPI = require('../lib/coupang_api_requester');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({ uploadDir: path.join(__dirname, '../uploads') });
const {not_logined_redirect_login} = require("../middleware/access_control")

router.use(not_logined_redirect_login);

router.get('/test/access', (req,res)=>{
    const message = "success"
    res.send({message})
})

//출고지 조회
router.post('/qry/outbound', (req, res) => {
    coupangAPI.getData({
        method: 'GET',
        path: '/v2/providers/marketplace_openapi/apis/api/v1/vendor/shipping-place/outbound',
        query: 'placeNames=CHINA_BRIDGE'
    }).then(result => {
        res.send(result);
    })
})


//반품지 조회
router.post('/qry/rsc', (req, res) => {
    coupangAPI.getData({
        method: 'GET',
        path: `/v2/providers/openapi/apis/api/v4/vendors/${coupangAPI.getVendorIdentity()}/returnShippingCenters`,
        query: ''
    }).then(result => {
        res.send(result);
    })
})

//카테고리 추천
router.post('/qry/catepred', (req, res) => {
    const productName = req.body.productName;
    console.log({ productName })
    coupangAPI.getData({
        method: 'POST',
        path: `/v2/providers/openapi/apis/api/v1/categorization/predict`,
        query: ''
    }, { productName }).then(result => {
        res.send(result);
    })
})

//카테코리 메타정보 조회
router.post('/qry/catemeta', (req, res) => {
    const displayCategoryCode = req.body.displayCategoryCode;
    console.log({ displayCategoryCode })
    coupangAPI.getData({
        method: 'GET',
        path: `/v2/providers/seller_api/apis/api/v1/marketplace/meta/category-related-metas/display-category-codes/${displayCategoryCode}`,
        query: ''
    }).then(result => {
        res.send(result);
    })
})


//게시판 사진 업로드
router.post('/coupang/editor/fileupload', multipartMiddleware, (req, res) => {
    const physical_path = req.files.editor_uploaded_file.path;
    const basename = path.basename(physical_path);
    const app_path = path.join("uploads", basename)

    res.send(app_path)
})

//상품등록 autoFiles : false
router.post('/create/product',multipart(), (req, res) => {
    const editordata = req.body.editordata
    console.log(editordata)
    console.log(req.body.sellerProductName)
})

module.exports = router;