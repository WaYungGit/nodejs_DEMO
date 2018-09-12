var express = require('express');
var fs = require('fs');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var bodyParser = require('body-parser');

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(bodyParser.json());
app.use(express.static('js'));
app.use(express.static('css'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})

app.get('/download/*', function (req, res) {
	var date = new Date();
	var file = req.params[0];
    console.log("get download file is " + file);
    var path = "download/" + file;
    var f = fs.createReadStream(path);
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var downfilename = 'license'+year+month+day+hour+minute+'.zip';
	
    res.writeHead(200, {
        'Content-Type': 'application/force-download',
        'Content-Disposition': 'attachment; filename='+downfilename
    });
    f.pipe(res);

})

app.post('/getlicense', function (req, res) {
	var id = req.body.id;
	console.log("id:"+id);
	var data = "";
	for(var i = 0; i < req.body.licenseinfo.length; i++)
	{
		data += req.body.licenseinfo[i].UID + " " + req.body.licenseinfo[i].MAC + " keyshare_0001\n";
	}
	var devinfofile = 'devinfo' + id;
	fs.writeFileSync('./license_generate_tool/'+devinfofile, data, function(err){
		if(err){
			console.log("write failed");
		}
		else{
			console.log("write ok");
		}
			
	});
	
	var cmd = 'sh run.sh '+ id;

    execSync(cmd, function (err, stdout, stderr) {
        if (err) {
            console.log("get action error:" + stderr);
        }
        else {
            console.log(stdout);
        }
    });
	
	res.send("ok");
})

var server = app.listen(8081, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("listen http://%s:%s", host, port)

})