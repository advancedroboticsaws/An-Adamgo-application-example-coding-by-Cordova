//Web Pages Dispatch by TTS
        function myDispatch(getTTS) {
            if ((getTTS == "项目一") || (getTTS == "简介")) {
                switchPage(888);
                Then("請自行選擇影片");
                setTimeout(function () {
                    pubSpeechSW(0);
                }, 2000);   
            }
            else if ((getTTS == "项目二") || (getTTS == "常见问题")) {
                switchPage(1);
                Then("請繼續選擇問題");
                setTimeout(function () {
                    pubSpeechSW(1);
                }, 2000);
            }   
            else if ((getTTS == "项目三") || (getTTS == "游戏")) {
                switchPage(3);
                Then("請自行選擇遊戲");       
                setTimeout(function () {
                    pubSpeechSW(0);
                    }, 2000);
            }
            else if ((getTTS == "项目四") || (getTTS == "工具")) {
                switchPage(4);
                Then("請繼續選擇工具");
                setTimeout(function () {
                    pubSpeechSW(1);
                }, 2000);
            }
            else if ((getTTS == "常见眼疾") || (getTTS == "问题三")) {
                switchPage(2);
                Then("請繼續選擇常見眼疾");
                setTimeout(function () {
                    pubSpeechSW(1);
                }, 2000);
            }
            else if ((getTTS == "乾眼症") || (getTTS == "干眼症")) {
                switchPage(51);
                Then("干眼症");
                setTimeout(function () {
                    pubSpeechSW(0);
                }, 2000);   
            }
            else if (getTTS == "结膜炎") {
                switchPage(52);
                Then("結膜炎");
                setTimeout(function () {
                    pubSpeechSW(0);
                }, 2000);   
            }
            else if ((getTTS == "工具一") || (getTTS == "工具1")) {
                switchPage(41);
                Then("工具一");
                setTimeout(function () {
                    pubSpeechSW(0);
                }, 2000);
            }
            else if ((getTTS == "工具二") || (getTTS == "工具2")) {
                switchPage(42);
                Then("工具二");
                setTimeout(function () {
                    pubSpeechSW(0);
                }, 2000);
            }
            else if ((getTTS == "工具三") || (getTTS == "工具3")) {
                switchPage(43);
                Then("工具三"); 
                setTimeout(function () {
                    pubSpeechSW(0);
                }, 2000);
            }
            else if ((getTTS == "工具四") || (getTTS == "工具4")) {
                switchPage(44);
                Then("工具四"); 
                setTimeout(function () {
                    pubSpeechSW(0);
                }, 2000);
            }
            else if ((getTTS == "可以了") || (getTTS == "不用") || (getTTS == "不用了")|| (getTTS == "好了")|| (getTTS == "停止")|| (getTTS == "没有")|| (getTTS == "谢谢")) {
                Then("好的");
                setTimeout(function () {
                    pubSpeechSW(0);
                }, 1000);
            }
            else if ((getTTS == "回到主画面") || (getTTS == "回到主画") || (getTTS == "回到首页") || (getTTS == "回首页") || (getTTS == "古拜") || (getTTS == "拜拜") || (getTTS == "结束") || (getTTS == "回到主选单") || (getTTS == "回到主选") || (getTTS == "回到开头")){
                switchPage(0);
            }
            else {
                Then("請在說一次");
                setTimeout(function () {
                    pubSpeechSW(1);
                }, 2000);
            }
        }
        
//Disable Web Pages
        function disablePages(){
                document.getElementById("Page0").style.display="none";
                document.getElementById("Page1").style.display="none";
                document.getElementById("Page2").style.display="none";
                document.getElementById("Page3").style.display="none";
                document.getElementById("Page4").style.display="none";
                document.getElementById("Page51").style.display="none";
                document.getElementById("Page52").style.display="none";
                document.getElementById("PageVideo").style.display="none";
                document.getElementById("Page41").style.display="none";
                document.getElementById("Page42").style.display="none";
                document.getElementById("Page43").style.display="none";
                document.getElementById("Page44").style.display="none";
        }
        
//Web Pages Dispatch
        function switchPage(i) {
            if(i==1){
                disablePages();
                document.getElementById("Page1").style.display="block";
            }
            else if(i==2){
                disablePages();
                document.getElementById("Page2").style.display="block";
            }
            else if(i==3){
                disablePages();
                document.getElementById("Page3").style.display="block";
            }
            else if(i==4){
                disablePages();
                document.getElementById("Page4").style.display="block";
            }
            else if(i==51){
                disablePages();
                document.getElementById("Page51").style.display="block";
            }
            else if(i==52){
                disablePages();
                document.getElementById("Page52").style.display="block";
            }
            else if(i==41){
                disablePages();
                document.getElementById("Page41").style.display="block";
            }
            else if(i==42){
                disablePages();
                document.getElementById("Page42").style.display="block";
            }
            else if(i==43){
                disablePages();
                document.getElementById("Page43").style.display="block";
            }
            else if(i==44){
                disablePages();
                document.getElementById("Page44").style.display="block";
            }
            else if(i==888){
                disablePages();
                document.getElementById("PageVideo").style.display="block";
            }
            else{
                disablePages();
                document.getElementById("Page0").style.display="block";
            }
        }