// khai báo require module evilscan
var evilscan = require('evilscan')
// khai báo require module express
,   express = require('express');

// khởi tạo ứng dụng express
var app = express();

// ứng dụng port-scanning tự giới thiệu về mình
app.get('/', function(req, res){
  res.send('<h1>Tui tên là port-scanning.<br>'+
    'Tui chạy rất nhanh và rất nguy hiểm.<br>'+
    '<a href="http://vietjs.com/?p=9">http://vietjs.com/2014/06/01/quet-cong-mang-sieu-nhanh-su-dung-node-js/</a></h1>');
});

// ứng dụng port-scanning làm việc 
app.get('/port/scan', function (req, res) {
  var ips = req.query.ip
  ,   ports = req.query.port
  ,   options = {}
  ,   results = [];

  // kiểm tra lỗi và trả về thông báo khi thiếu thông tin
  if (!ips || !ports) {
    res.send(400, 'Missing ip or port params. Correctly URL is /port/scan?ip=192.168.0.1&port=22');
    return;
  }

  // khai báo options cho evilscan
  // xem thông tin đầy đủ tại https://github.com/eviltik/evilscan
  options = {
    target: ips, // địa chỉ IP, dãy IP
    port: ports, // cổng
    status:'TROU', // ?
    banner: true, // hiển thị biểu ngữ của cổng kết nối
    concurrency: 255, // số lượng kết nối đồng thời
    timeout: 2000, // thời gian chờ kết nối (ms)
    geo: true, // xác định vị trí địa lý của địa chỉ IP
    reverse: true // hiển thị thông tin reverse dns
  };;

  // khởi tạo evilscan scanner
  var scanner = new evilscan(options, function () {
    // khởi tạo xong scanner
  });
    
  // khi quét có kết quả, lưu kết quả vào biến results
  scanner.on('result', function (data) {
    results.push(data);
  });

  // khi có lỗi, trả về thông báo lỗi
  scanner.on('error', function (err) {
    res.send(500, 'evilscan error: ' + err);
  });

  // khi quét xong, kết thúc xử lý cho truy vấn này và trả về kết quả
  scanner.on('done', function () {
    res.send(results);
  });

  // chạy evilscan scanner
  scanner.run();
});

var HTTP_PORT = process.env.PORT || 3000;
app.listen(HTTP_PORT);
console.log('port-scanning application listening at 0.0.0.0:' + HTTP_PORT);