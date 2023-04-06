// 所有的dom对象和资源加载完后才会加载
window.onload = function () {

    // 声明一个纪录点击的缩略图下标
    let bigimgIndex = 0;
    //  路径导航数据渲染
    function navPathDataBind() {
        /* 先获取路径导航的页面元素，navPath
            获取所需要的数据，数据在js/data.js  goodData.path
            数据的数据是动态产生的，相应的dom元素也应该是动态产生的，需要创建dom元素根据数据数量的多少
            最后遍历数据创建dom元素的最后一条，只创建a，不创建按i标签
         
         */
        // 获取页面导航的元素对象
        let navPath = document.querySelector('#wrapper #content .contentMain #navPath');
        // 获取数据
        let path = goodData.path;
        // 遍历数据
        path.forEach(item => {
            //  创建a标签
            let aNode = document.createElement('a');
            aNode.href = item.url;
            aNode.innerText = item.title
            // 创建i标签
            let iNode = document.createElement('i');
            iNode.innerText = '/';
            // navpath进行追加a和i
            navPath.appendChild(aNode);
            navPath.appendChild(iNode)
        })
        navPath.removeChild(navPath.lastChild)
        navPath.lastChild.href = "###"
    }
    navPathDataBind();
    // 放大镜的移入移除
    function bigClassBind() {
        /* 
          获取小图框元素对象，设置移入事件（onmouseenter
          动态创建蒙版元素和大突破大图片元素
          移出时移除蒙版元素和大图框

        */
        //    获取小图框元素
        let smallPic = document.querySelector('#wrapper #content .contentMain #center #left #leftTop #smallPic');
        let leftTop = document.querySelector('#wrapper #content .contentMain #center #left #leftTop');
        // 获取数据
        let imagessrc = goodData.imagessrc;

        // 设置移入事件
        smallPic.addEventListener('mouseenter', function () {
            //  创建蒙版元素
            let maskDiv = document.createElement('div');
            maskDiv.className = 'mask';
            // 创建大图框元素
            let bigPic = document.createElement('div');
            bigPic.id = 'bigPic';
            // 创建大图片元素
            let bigImg = document.createElement('img');
            bigImg.src = imagessrc[bigimgIndex].b;
            // 大图框追加大图片
            bigPic.appendChild(bigImg);
            // 让小图框追加蒙版元素
            smallPic.appendChild(maskDiv)
            // leftTop追加大图框
            leftTop.appendChild(bigPic)
            //   设置鼠标移动事件
            smallPic.onmousemove = function (e) {
                // event.clientX 鼠标点距离浏览器左侧的值
                // getBoundingClientRect().left
                let left = e.clientX - smallPic.getBoundingClientRect().left - maskDiv.offsetWidth / 2;
                let top = e.clientY - smallPic.getBoundingClientRect().top - maskDiv.offsetHeight / 2;
                // 判断边界
                if (left < 0) {
                    left = 0;
                } else if (left > smallPic.clientWidth - maskDiv.offsetWidth) {
                    left = smallPic.clientWidth - maskDiv.offsetWidth;
                }
                if (top < 0) {
                    top = 0;
                } else if (top > smallPic.clientHeight - maskDiv.offsetHeight) {
                    top = smallPic.clientHeight - maskDiv.offsetHeight;
                }
                // 设置left和top属性
                maskDiv.style.left = left + 'px';
                maskDiv.style.top = top + 'px';

                // 移动比例关系 =蒙版移动距离/大图片元素移动的距离
                // 蒙版元素移动的距离=小图框宽度-蒙版元素宽度
                // 大图片元素移动的距离=大图片宽度-大图框元素的宽度
                let scale = (smallPic.clientWidth - maskDiv.offsetWidth) / (bigImg.offsetWidth - bigPic.clientWidth);
                // 
                bigImg.style.left = -left / scale + 'px';
                bigImg.style.top = -top / scale + 'px';

            }
            // 设置鼠标离开效果
            smallPic.onmouseleave = function () {
                // 让小图框移除蒙版元素
                smallPic.removeChild(maskDiv)
                // lefttop移除大图框
                leftTop.removeChild(bigPic)
            }


        })

    }
    bigClassBind()

    // 动态渲染放大镜缩略图数据
    function thumbnailData() {
        /* 先获取piclist下的ul元素
           获取data。js下的goodData的imagessrc
           遍历数组，根据数组遍历的长度创建li
           ul遍历追加li元素

        */
        let ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #piclist ul');
        // 获取imagessrc数据
        let imagessrc = goodData.imagessrc;
        for (let i = 0; i < imagessrc.length; i++) {
            // 创建li元素
            let newLi = document.createElement('li');
            // 创建img元素
            let newImg = document.createElement('img');
            newImg.src = imagessrc[i].s;
            // 让li追加img元素
            newLi.appendChild(newImg);
            //   ul追加li
            ul.appendChild(newLi)

        }
    }
    thumbnailData()
    // 点击缩略图效果
    function thumbnailClick() {
        /* \
            获取所有li元素 循环发生点击事件（自我感觉事件的委派）看老师怎么将
            夸函数的数据传递  点击缩略图需要确定其下标位置来找到对应的小图路径和大图路径替换现在src的值

        */
        //    获取所有li元素
        let li = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #piclist ul li')
        // 
        let smallPic_img = document.querySelector('#wrapper #content .contentMain #center #left #leftTop #smallPic img')

        let imagessrc = goodData.imagessrc;
        smallPic_img.src = imagessrc[0].s;
        //  循环点击这些li标签
        for (let i = 0; i < li.length; i++) {
            li[i].onclick = function () {
                bigimgIndex = i;
                // 变化小图路径

                smallPic_img.src = imagessrc[i].s
            }
        }

    }
    thumbnailClick()
    // 左右点击轮播效果
    function thumbnailLeftRightClick() {
        /* 
          获取左右两边的箭头按钮
          获取可视的div以及ul元素和所有的li元素
          发生点击事件
          
        */
        //    获取箭头元素
        let prev = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom a.prev');
        let next = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom a.next');
        // 获取可视的div以及ul元素和所有的li元素
        // let piclist = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #piclist');
        let ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #piclist ul')
        let lis = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #piclist ul li')
        //        计算初始值
        let start = 0;
        let step = (lis[0].offsetWidth + 20) * 1;

        // 总体距离  ul宽度-div宽度     
        let endPosition = (lis.length - 5) * (lis[0].offsetWidth + 20);
        prev.onclick = function () {
            start -= step;
            if (start < 0) {
                start = 0
            }
            ul.style.left = -start + 'px'
        }
        next.onclick = function () {
            start += step;
            if (start > endPosition) {
                start = endPosition
            }
            ul.style.left = -start + 'px'
        }

    }
    thumbnailLeftRightClick()

    // 商品详情动态渲染
    function rightTopData(params) {
        /* 
           查找righttop元素
           查找datajslimgooddata-gooddatalist
           建立一个字符串变量将原来的布局结构贴近来，将多对应的数据重新放在上面渲染top元素
        */
        let rightTop = document.querySelector('#wrapper #content .contentMain #center .right .rightTop ')
        //   找数据
        let goodsDetail = goodData.goodsDetail;
        // console.log(goodsDetail);

        //    创建字符串变量 
        let s = `  <h3>${goodsDetail.title}</h3>
                <p>${goodsDetail.recommend}</p>
                <div class="priceWrap">
                  <div class="priceTop">
                    <span>价&nbsp;&nbsp;&nbsp;&nbsp;格</span>
                    <div class="price">
                      <span>￥</span>
                      <p>${goodsDetail.price}</p>
                      <i>通知</i>
                    </div>
                    <p>
                      <span>评价</span>
                      <span>${goodsDetail.evaluateNum}</span>
                    </p>
                  </div>
                  <div class="priceBottom">
                    <span>促&nbsp;&nbsp;&nbsp;&nbsp;销</span>
                    <p>
                      <span>${goodsDetail.promoteSales.type}</span>
                      <span>${goodsDetail.promoteSales.content}</span>
                    </p>
                  </div>
                </div>
                <div class="support">
                  <span>支&nbsp;&nbsp;&nbsp;&nbsp;持</span>
                  <p>${goodsDetail.support}</p>
                </div>
                <div class="address">
                  <span>配&nbsp;送&nbsp;至</span>
                  <p>${goodsDetail.address}</p>
                </div>`;

        //   重新渲染righttop元素
        rightTop.innerHTML = s;

    }
    rightTopData()

    // 商品参数数据的动态渲染
    function rightBottomData() {
        /* 
          找rightbottom元素对象
          查找datajs下gooddatagooddetail crumbdata数据
          数据是数组，进行遍历，动态玄坛dl元素对象（dt，dd）
          
        
        */
        let chooseWrap = document.querySelector('#wrapper #content .contentMain #center .right .rightBottom .chooseWrap');
        let crumbData = goodData.goodsDetail.crumbData;
        // console.log(crumbData);
        for (let i = 0; i < crumbData.length; i++) {
            //创建dl元素对象
            let dl = document.createElement('dl');
            // 创建dt元素对象
            let dt = document.createElement('dt')
            dt.innerText = crumbData[i].title;
            // dl追加dt
            dl.appendChild(dt);
            //    遍历dd元素
            for (let j = 0; j < crumbData[i].data.length; j++) {
                //   创建ddl
                let dd = document.createElement('dd');
                dd.innerText = crumbData[i].data[j].type;
                dd.setAttribute('price', crumbData[i].data[j].changePrice)
                // dl 追加dd
                dl.appendChild(dd)

            }

            chooseWrap.appendChild(dl)
        }

    }
    rightBottomData()
    // 
    //    点击商品参数
    function clickddBind() {
        /* 
      //   获取所有的dl元素，取其中第一个dl元素下的所有的dd做测试,嵌套所有的变换下标
           循环所有的dd元素并且添加点击事件
           确定实际发生的目标源对象，然后给其他所有的颜色充值为基础颜色 ，5，216，235

        //    全用for循环，且定义是var，回调是异步，会先执行同步的再回调，上面的就不会生效  
          
             先创建容纳点击dd的容器，确定数组的起始长度，添加默认值
             将点击的dd元素的值按照对应下标写入到数组的元素身上
        */
        let dlNodes = document.querySelectorAll('#wrapper #content .contentMain #center .right .rightBottom .chooseWrap dl');
        let choose = document.querySelector('#wrapper #content .contentMain #center .right .rightBottom .choose')
        //  设置一个参数就是设置数组的长度
        let arr = new Array(dlNodes.length);
        arr.fill(0);
        // console.log(arr);[0,0,0,0]

        for (let j = 0; j < dlNodes.length; j++) {
            let ddNodes = dlNodes[j].querySelectorAll('dd')

            // 遍历当前所有的dd元素
            for (let i = 0; i < ddNodes.length; i++) {


                ddNodes[i].onclick = function () {
                    ddNodes.forEach(item => item.style.color = "rgb(119,153,117)")

                    ddNodes[i].style.color = "rgb(5,216,235)"
                    choose.innerHTML = ''
                    // 点击哪个元素就产生新的mark 先准备容器
                    arr[j] = this;
                    changePriceBind(arr);//传入实参
                    // console.log(arr);
                    // 遍历arr数组，将非0元素的值写入到mark、标签中
                    arr.forEach((item, index) => {
                        // 只要是为真的条件就动态创建标签
                        if (item) {
                            // 创建div元素设置class属性
                            let markDiv = document.createElement('div');
                            markDiv.className = "mark";
                            markDiv.innerText = item.innerText;
                            // 创建a元素设置值
                            let aNode = document.createElement('a');
                            aNode.innerText = 'X';
                            // 并且设置下标
                            aNode.setAttribute('index', index)
                            markDiv.appendChild(aNode);
                            // choose循环追加div
                            choose.appendChild(markDiv)


                        }
                    })
                    // 获取所有的a标签，并循环再次发生点击事件
                    let aNodes = document.querySelectorAll('#wrapper #content .contentMain #center .right .rightBottom .choose .mark a')
                    // console.log(aNodes);
                    for (let n = 0; n < aNodes.length; n++) {
                        aNodes[n].onclick = function () {
                            //  获取点击a标签身上的index属性值
                            let idx1 = this.getAttribute('index');
                            //    点击完后恢复数组
                            arr[idx1] = 0;
                            // 查找对应下标哪个dl行中的所有dd元素
                            let ddlist = dlNodes[idx1].querySelectorAll('dd')
                            // console.log(ddlist);
                            // 遍历所有的dd元素
                            for (let m = 0; m < ddlist.length; m++) {
                                ddlist[m].style.color = '#77c19d'
                            }
                            // 默认的第一个颜色恢复成蓝色
                            ddlist[0].style.color = '#05d8eb'

                            // 删除对应下标位置的mark标记
                            choose.removeChild(this.parentNode)

                            // 调用价格函数
                            changePriceBind(arr)
                        }
                    }

                }

            }

        }

    }
    clickddBind()

    // 价格调用函数声明
    /**
     * 在点击dd的时候以及删除mark的时候调用
     */
    function changePriceBind(arr) {
        /**
         * 获取价格标签元素
         * 给每一个dd标签身上默认设置一个自定义属性，用来纪录变化的价格
         * 遍历arr数组将dd元素身上变化的价格和已有的价格相加
         * 将计算好的结果重新渲染到p标签中
         */
        let oldPrice = document.querySelector('#wrapper #content .contentMain #center .right .rightTop .priceWrap .priceTop .price p')
        let price = goodData.goodsDetail.price;
        //  遍历arr数组
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]) {
                // 数据类型的强制转换
                let changePrice = (Number(arr[i].getAttribute('price')));
                // 最终价格
                price += changePrice

            }
        }

        oldPrice.innerText = price

        // 
        let leftprice = document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left p')
        leftprice.innerText = '$' + price
        // 判断
        // 遍历选择搭配当中所有的复选元素,查看是否选中
        let ipts = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle li input')
        let newprice = document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i')

        ipts.forEach(item => {
            if (item.checked) {
                price += Number(item.value)
            }
        })

        newprice.innerHTML = '$' + price
    }

    // 选择中间区域复选框选中套餐价格变动效果
    function chooseprice() {
        /**
         * 把当前复选框所有的元素拿到
         * 遍历元素取出价格进行累加,和左侧基础价格进行累加,累加过后重新写回套餐价,
         * 
         */

        let ipts = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle li input')
        let leftprice = document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left p')
        let newprice = document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i')
        // 遍历复选框
        for (let i = 0; i < ipts.length; i++) {
            ipts[i].onclick = function () {

                let oldprice = Number(leftprice.innerText.slice(1))
                for (let j = 0; j < ipts.length; j++) {
                    if (ipts[j].checked) {
                        // 左侧价格加上复选框附加价格
                        oldprice += Number(ipts[j].value);

                    }
                }
                // 写回到套餐加标签
                newprice.innerText = '$' + oldprice
            }


        }
    }
    chooseprice()


    // 封装公共的选项卡函数
    /**
     * 第一个被点击的元素tabBtns
     * 被切换的元素  tabConts
     * 
     */
    function Tab(tabBtns, tabConts) {
        for (let i = 0; i < tabBtns.length; i++) {
            tabBtns[i].onclick = function () {
                for (let j = 0; j < tabBtns.length; j++) {
                    tabBtns[j].className = ''
                    tabConts[j].className = ''
                }

                this.className = 'active'
                tabConts[i].className = 'active'
            }


        }

    }

    // 点击左侧选项卡
    function leftTab() {
        let h4s = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .leftAside .asideTop h4');
        let divs = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .leftAside .asideContent >div')
        Tab(h4s, divs)
    }
    leftTab()
    function rigthTab() {
        let lis = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .bottomDetail .tabBtns li')
        let divs = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .bottomDetail .tabContents div')
        Tab(lis, divs)
    }
    rigthTab()

    // 右边侧边栏点击效果
    function rigthAsideBind() {
        /**
         * 找到按钮元素
         * 加点击事件
         * 纪录初始状态
         * 在点击事件内部判断
         * 
         */
        let btns = document.querySelector('#wrapper .rightAside .btns')
        let rightAside = document.querySelector('#wrapper .rightAside')

        // 纪录初始状态
        let flag = true

        // 发生点击事件
        btns.onclick = function () {
            if (flag) {
                // flag = false
                btns.className = 'btns btnsClose'
                rightAside.className = "rightAside asideClose"

            } else {
                // flag = true
                btns.className = 'btns btnsOpen'
                rightAside.className = "rightAside asideOpen"

            }

            flag = !flag

        }
    }
    rigthAsideBind()
}