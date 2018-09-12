
function getlicense()
{
	var query = 0;
	var jsonArray = new Array();

	$("#licenseinfoid").each(function(){
		$(this).find('tr').each(function(){
			var tdArr = $(this).find('td');

			var tdUID = tdArr.eq(1).find('input').val();
			var tdMAC = tdArr.eq(2).find('input').val();
			if(tdUID != '' && tdMAC != ''){
				var tdData = {
					"UID":tdUID,
					"MAC":tdMAC
					
				};
				
				jsonArray.push(tdData);
			}
		})
	})
	var id = Math.random();
	query = '{"id":' + id + ', "licenseinfo":'+JSON.stringify(jsonArray)+'}';
	
	var getlicenseurl = '/getlicense';
	console.log("getlicense query:"+query);
    $.ajax({
		type:'post',
		data:query,
		datatype:'text',
		url:getlicenseurl,
		contentType:"application/json",
		success:function(data){
			console.log(data);
		    var $eleForm = $("<form method='get'></form>");

            $eleForm.attr("action", "download/license" + id + ".zip");

            $(document.body).append($eleForm);

            $eleForm.submit();
		},
	  });
	
}

function licenseinfodel(obj)
{
	var mytr = $(obj).parent().parent();
	
	mytr.remove();
}

function licenseinfoadd(obj)
{
	var mytr = $(obj).parent().parent();
	var tr = mytr.clone();
	tr.find('td').eq(1).find('input').val('');
	tr.find('td').eq(2).find('input').val('');
	
	$("#licenseinfoid").append(tr);

	mytr.find('td').eq(0).find('button').html('-');
	mytr.find('td').eq(0).find('button').attr("onclick", "licenseinfodel(this)");
}

function checkuid(obj)
{
	var r1 = /^[0-9a-f]*$/g;
	var r2 = /[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}/;
	if(!r1.test(obj.value) || obj.value.length != 32){
			alert("UID:"+obj.value+" 不合法!请输入字母(a~f)和数字(0~9)的组合!且长度必须为32!");
			//$('#submitbtn').attr('disabled', 'true');
			return false;
	}
	var macobj = $(obj).parent().parent().find('td').eq(2).find('input');
	if(!r2.test(macobj.val()) || macobj.val().length != 17){
			//$('#submitbtn').attr('disabled', 'true');
			console.log("checkuid mac is not valid!mac:"+macobj.val());
	}
	else
		$('#submitbtn').removeAttr('disabled');
	return true;
}

function checkmac(obj)
{
	var r1 = /^[0-9a-f]*$/g;
	var r2 = /[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}/;
	if(!r2.test(obj.value) || obj.value.length != 17){
			alert("MAC:"+obj.value+" 不合法!请输入正确的MAC地址格式!");
			//$('#submitbtn').attr('disabled', 'true');
			return false;
	}
	var uidobj = $(obj).parent().parent().find('td').eq(1).find('input');
	if(!r1.test(uidobj.val()) || uidobj.val().length != 32){
			//$('#submitbtn').attr('disabled', 'true');
			console.log("checkmac uid is not valid!uid:"+uidobj.val());
	}
	else
		$('#submitbtn').removeAttr('disabled');
	return true;
}
