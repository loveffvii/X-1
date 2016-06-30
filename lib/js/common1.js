$(document).ready(function () {

    //聊天页面
    //消息弹出框
    $('.menber-list .xiaoxi').on('click', function () {
        layer.open({
            type: 2,
            title: '系统消息弹出框',
            shadeClose: true,
            shade: 0.8,
            area: ['600px', '600px'],
            content: 'http://192.168.0.156:7352/Systemmessage.html' //iframe的url
        });
    });

    //填写电子病历小提示
    $(".write").hover(function () {
        $(this).children(".tips").show();
    }, function () {
        $(this).children(".tips").hide();
    });

    //快捷回复小提示
    $(".items li").hover(function () {
        $(this).children(".tips").show();
    }, function () {
        $(this).children(".tips").hide();
    });
    $(".items li a").click(function () {
        $(this).siblings(".nav-1").toggle();
    });

    
    //系统菜单
    $(".system-list dl").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        var n = $(this).index();
        $(".menber").children().eq(n).show().siblings().hide();
    });

    //成员出现
    $(".menber-list li").click(function (e) {
        if ($(this).children(".frend").css("display") == "none" && (e.target.tagName == 'I' || e.target.tagName == 'A')) {
            $(this).children(".frend").show();
            $(this).children(".sanjiaoxing").css("transform", "rotate(90deg)")
        }
        else if (e.target.tagName == 'I' ) {
            $(this).children(".frend").hide();
            $(this).children(".sanjiaoxing").css("transform", "rotate(0deg)")
        }
    });

    //点击成员 背景变化
    //$(".frend dl").addClass("blue").siblings().removeClass("blue");

    //消息条数的出现
    $(".menbers dd .messagenumber").each(function () {
        var z = $(this).html();
        if (z > 0||z==" ") {
            $(this).css("display", "block")
        } else {
            $(this).css("display", "none")
        }
    });
    //成员个数的计算
    $(".frend").each(function (i,o) {
        var p = $(o).children("dl").length;
       
        $(o).siblings(".personnumber").html(p);
        
    });




    //添加快捷回复弹出框
    $('.addanswer').on('click', function () {
        layer.open({
            type: 1,
            area: ['300px', '250px'],
            shadeClose: true, //点击遮罩关闭
            content: '<div class="kjhfltck"><p><i class="iconfont">&#xe613;</i>添加快捷回复</p><textarea rows="4" name="kjhfltck" class="add" placeholder="添加快捷回复"></textarea><div class="sure"><input type="button" value="取消" class="quxiao"/> <input type="button" value="确定"  class="queding"/></div></div>'
        });
    });
    //快捷回复“取消”关闭按钮
    //$(".sure .quxiao").on("click", function () {
    //    $(".kjhfltck").hide();
    //});

   
    //注销退出
    function loginout() {
        layer.confirm('是否要退出登录？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            //layer.msg('已结束当前咨询');
            window.location.href = "../../login2.aspx";
        });
    };

 


    //历史电子病历
    $(".dropdown-menu li").on('click', function () {
        layer.open({
            type: 2,
            title: '历史电子病历预览',
            shadeClose: true,
            shade: 0.8,
            area: ['450px', '500px'],
            content: 'http://192.168.0.156:7352/dzblyl.html' //iframe的url
        });
    });
    //关闭按钮
    $(".emrecord h2 .iconfont").on('click', function () {
        //$(this).parents(".emrecord").hide();
        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
        parent.layer.close(index);
    });

    //我的患者资料页面


    //患者个人资料，电子病历
    $(".bingli a").on('click', function () {
        $(this).siblings(".bldetail").toggle();
    });
    //点击电子病历li弹出历史病历详情
    $('.bldetail li').on('click', function () {
        $(this).addClass("gray").siblings().removeClass("gray");
        layer.open({
            type: 2,
            title: '历史病历',
            shadeClose: true,
            shade: 0.8,
            area: ['450px', '500px'],
            content: 'http://192.168.0.156:7352/dzblyl.html' //iframe的url
        });
    });

    //历史聊天框
    //点击图标，弹出结束咨询、历史咨询
    $(".tubiao .iconfont").on("click", function () {
        $(this).siblings(".droplist").toggle();
    });

    //结束咨询
    $(".jieshu").on("click", function () {
        layer.confirm('是否结束本次咨询？', {
            btn: ['确定', '取消'] //按钮
        });
    });

    //点击历史咨询，弹出历史咨询列表
    $(".droplist li").on("click", function () {
        $(this).children(".dropdown-menu").toggle();
    });

    //导航切换
    $(".system-list dl").on("click", function () {
        $(this).addClass("active");
    });


    //点击电子病历预览关闭按钮，所有层关闭
    $(".emrecord h2 .iconfont").on("click", function () {
        $(".layui-layer-shade").each(function () {
            $(this).css("display", "none");
        });
    });


    ////填写电子病历
    ////处方删除
    //$(".hisdrug .iconfont").on('click', function () {
    //    $(this).parents(".hisdrug").hide();
    //});

    ////点击添加，到处方里形成一条记录
    //$(".adding").on('click', function () {s
    //    //获取yaoping中的内容
    //    var text1 = $(".yaoname").val();
    //    var text2 = $(".yongliang").val();
    //    var text3 = $(".yongfa").val();
    //    var text4 = $(".pinglv").val();
    //    //将获取的内容传到处方记录中
    //    var str = text1 + '、' + text2 + '、' + text3 + '、' + text4;
    //    $(".chufang").val(str);
    //    var a = $(".chufang").val();
    //    //console.log(a);
    //    //点击添加，将内容追加到之前.chufang
    //    //var z = $(".chufanglist .hisdrug").html();
    //    //console.log(z);
    //    $(".chufanglist").append('<div class="hisdrug"><div class="ways chufang">' + a + '</div><i class="iconfont">&#xe617;</i></div>');

    //});

    //历史用药删除
    $(".drugs li .iconfont").on('click', function () {
        $(this).parent("li").remove();
    });

    //图片资料删除
    $(".informationpc li .iconfont").on('click', function () {
        $(this).parent("li").remove();
    });


});