<%@ Page Language="C#" AutoEventWireup="true" CodeFile="MainShow.aspx.cs" Inherits="MainShow" %>

<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=0;">
	<title>橡皮擦效果</title>
	<style type="text/css">
		html,body{
			width: 100%;
			height: 100%;
			margin:0;
			padding:0;
		}
		.view{ 
			position: relative;
			width: 100%;
			height: 100%;
			overflow: hidden;
		}
		.box{
			position: absolute;
			left:0;
			top:0;
			width: 100%;
			height: 100%;
			/*background:#000 url("pic1.jpg") no-repeat center center;*/
			/*background-size: auto 100%;*/
			backface-visibility: hidden;
			overflow: hidden;
		}
		/*#cas{
			opacity: 1;
			-webkit-transition:opacity .5s;
			-ms-transition:opacity .5s;
			-moz-transition:opacity .5s;
		}*/
		canvas{
			opacity: 1;
			-webkit-transition:opacity .5s;
			-ms-transition:opacity .5s;
			-moz-transition:opacity .5s;
		}
		.noOp{
			opacity: 0 !important;
		}
	</style>
    <script src="lib/js/jquery-1.9.1.min.js"></script>
</head>
<body>
<div class="view">
	<div class="box" id="bb">
		<%--<canvas id="cas" ></canvas>--%>
         <table>
         <tbody id="imglists">
           <%--  <% =rowInnerHtml %>--%>
         </tbody>
         </table>
	</div>
       <%--<asp:Image id="ss" runat="server" ImageUrl="test.aspx"></asp:Image>--%>
    <%-- <table>
         <tbody>
             <%--<% =rowInnerHtml %>
         </tbody>
     </table>--%>
</div>

<script type="text/javascript" charset="utf-8">
    window.onload = function () {      
        $.ajax({
            type: "post",
            url: "ajax/LoadImage.ashx",
            //data: { tem},
            dataType: "JSONP",
            success: function (data) {
                var sda = 1;
            },
            error: function (data) {
                //alert('数据加载失败');
                var data = JSON.parse(data.responseText);
                var tempcontent = '';
                var countemp = 0;
                var image;
                //var container = document.getElementById('imglists');
                var container =$('#imglists');
                for (var iw = 0; iw < data.hight; iw++)
                {
                    var trDisplay = $("<tr></tr>");
                    container.append(trDisplay);
                    for (var ih = 0; ih < data.width; ih++)
                    {
                        var td = $("<td></td>");
                        var createobj = jQuery("<div style=\"position:relative;left:" + (200 + ih * 700) + "px;top:" + (200 + iw * 500) + "px\"><div id=\"subid" + countemp + "\" style=\"position:absolute;left:0px;top:0px\"><canvas id=\"png" + countemp
                            + "\" width=\"640\" height=\"400\"></canvas></div><div style=\"position:absolute;left:0px;top:0px;z-index:-1;\"><image src=\"data:image/png;base64,"
                            + data.imglist[countemp].imgstring + "\"/></div></div>");
                        td.append(createobj);     
                        trDisplay.append(td);
                        loadCanvas("png" + countemp, "subid" + countemp);
                        countemp++;
                        if (countemp >= data.imglist.length) break;
                        //if (countemp >= 100) break;
                    }
                                
                }
            }
        });
    }
    function loadCanvas(c1,c2)
    {
        var canvas = document.getElementById(c1), ctx = canvas.getContext("2d");


        var x1, y1, a = 30, timeout, totimes = 100, distance = 30;
        var saveDot = [];
        var canvasBox = document.getElementById(c2);

        canvas.width = canvasBox.clientWidth;
        canvas.height = canvasBox.clientHeight;

        var img = new Image();
        img.src = "pic6.JPG";
        img.onload = function () {
            var w = canvas.height * img.width / img.height;
            ctx.drawImage(img, (canvas.width - w) / 2, 0, w, canvas.height);
            tapClip();
        };

        function getClipArea(e, hastouch) {
            var x = hastouch ? e.targetTouches[0].pageX : e.clientX;
            var y = hastouch ? e.targetTouches[0].pageY : e.clientY;
            var ndom = canvas;

            while (ndom.tagName !== "BODY") {
                x -= ndom.offsetLeft;
                y -= ndom.offsetTop;
                ndom = ndom.parentNode;
            }

            return {
                x: x,
                y: y
            }
        }

        //通过修改globalCompositeOperation来达到擦除的效果
        function tapClip() {
            var hastouch = "ontouchstart" in window ? true : false,
                tapstart = hastouch ? "touchstart" : "mousedown",
                tapmove = hastouch ? "touchmove" : "mousemove",
                tapend = hastouch ? "touchend" : "mouseup";

            var area;
            var x2, y2;

            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.lineWidth = a * 2;
            ctx.globalCompositeOperation = "destination-out";

            window.addEventListener(tapstart, function (e) {
                clearTimeout(timeout);
                e.preventDefault();

                area = getClipArea(e, hastouch);

                x1 = area.x;
                y1 = area.y;

                drawLine(x1, y1);

                this.addEventListener(tapmove, tapmoveHandler);

                this.addEventListener(tapend, function () {
                    this.removeEventListener(tapmove, tapmoveHandler);

                    //检测擦除状态
                    timeout = setTimeout(function () {
                        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        var dd = 0;
                        for (var x = 0; x < imgData.width; x += distance) {
                            for (var y = 0; y < imgData.height; y += distance) {
                                var i = (y * imgData.width + x) * 4;
                                if (imgData.data[i + 3] > 0) { dd++ }
                            }
                        }
                        if (dd / (imgData.width * imgData.height / (distance * distance)) < 0.4) {
                            canvas.className = "noOp";
                        }
                    }, totimes)
                });

                function tapmoveHandler(e) {
                    clearTimeout(timeout);

                    e.preventDefault();

                    area = getClipArea(e, hastouch);

                    x2 = area.x;
                    y2 = area.y;

                    drawLine(x1, y1, x2, y2);

                    x1 = x2;
                    y1 = y2;
                }
            })
        }

        function drawLine(x1, y1, x2, y2) {
            ctx.save();
            ctx.beginPath();
            if (arguments.length == 2) {
                ctx.arc(x1, y1, a, 0, 2 * Math.PI);
                ctx.fill();
            } else {
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
            ctx.restore();
        }
    }
   

	//使用clip来达到擦除效果
	//function otherClip() {
	//	var hastouch = "ontouchstart" in window ? true : false,
	//		tapstart = hastouch ? "touchstart" : "mousedown",
	//		tapmove = hastouch ? "touchmove" : "mousemove",
	//		tapend = hastouch ? "touchend" : "mouseup";

	//	var area;

	//	canvas.addEventListener(tapstart, function (e) {
	//		clearTimeout(timeout);
	//		e.preventDefault();

	//		area = getClipArea(e, hastouch);

	//		x1 = area.x;
	//		y1 = area.y;

	//		ctx.save();
	//		ctx.beginPath();
	//		ctx.arc(x1, y1, a, 0, 2 * Math.PI);
	//		ctx.clip();
	//		ctx.clearRect(0, 0, canvas.width, canvas.height);
	//		ctx.restore();

	//		canvas.addEventListener(tapmove, tapmoveHandler);
	//		canvas.addEventListener(tapend, function () {
	//			canvas.removeEventListener(tapmove, tapmoveHandler);

	//			timeout = setTimeout(function () {
	//				var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	//				var dd = 0;
	//				for (var x = 0; x < imgData.width; x += distance) {
	//					for (var y = 0; y < imgData.height; y += distance) {
	//						var i = (y * imgData.width + x) * 4;
	//						if (imgData.data[i + 3] > 0) {
	//							dd++
	//						}
	//					}
	//				}
	//				if (dd / (imgData.width * imgData.height / (distance * distance)) < 0.4) {
	//					canvas.className = "noOp";
	//				}
	//			}, totimes)

	//		});

	//		function tapmoveHandler(e) {
	//			e.preventDefault();
	//			area = getClipArea(e, hastouch);
	//			x2 = area.x;
	//			y2 = area.y;

	//			var asin = a * Math.sin(Math.atan((y2 - y1) / (x2 - x1)));
	//			var acos = a * Math.cos(Math.atan((y2 - y1) / (x2 - x1)));
	//			var x3 = x1 + asin;
	//			var y3 = y1 - acos;
	//			var x4 = x1 - asin;
	//			var y4 = y1 + acos;
	//			var x5 = x2 + asin;
	//			var y5 = y2 - acos;
	//			var x6 = x2 - asin;
	//			var y6 = y2 + acos;

	//			ctx.save();
	//			ctx.beginPath();
	//			ctx.arc(x2, y2, a, 0, 2 * Math.PI);
	//			ctx.clip();
	//			ctx.clearRect(0, 0, canvas.width, canvas.height);
	//			ctx.restore();

	//			ctx.save();
	//			ctx.beginPath();
	//			ctx.moveTo(x3, y3);
	//			ctx.lineTo(x5, y5);
	//			ctx.lineTo(x6, y6);
	//			ctx.lineTo(x4, y4);
	//			ctx.closePath();
	//			ctx.clip();
	//			ctx.clearRect(0, 0, canvas.width, canvas.height);
	//			ctx.restore();

	//			x1 = x2;
	//			y1 = y2;
	//		}
	//	})
	//}
</script>
</body>
</html>
  

