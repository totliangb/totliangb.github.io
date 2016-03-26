$(function() {

	// 获取图片信息
	function init(){
		var imgData;
		$.ajax({
			url:"./index.json",
			type : "GET",
			dataType : 'json',
			success:function(data){
				build(data);
			}
		});
	};


	var lcm = function (arguments) {
		function gcd(a,b) {
			if (a == 0) return b;
			return gcd(b%a, a);
		}
		return Array.prototype.slice.apply(arguments).reduce(function(a,b) {return a*b / gcd(a,b);}, 1);
	};

	// 检查 数据能否组成一行
	function checkCreateCol(screen_width, cartArr , top){
		console.log('-----------'+cartArr.length+' start '+'----------------');
		// 标示 是否成功
		var checkFlag = true;

		var nowHeightArr = [];
		// 获取最小公倍数
		$.each(cartArr,function(i,item){
			nowHeightArr.push(item.height);
		});
		// 得到的最小公倍数
		var lcmNum = lcm(nowHeightArr);

		var lcmAfterAllWidth = 0;
		var lcmAfterItemWidth = 0;
		var lcmAfterWidthArr = [];
		// 计算 缩放后的高度
		$.each(cartArr,function(i,item){
			lcmAfterItemWidth = item.width * (lcmNum/item.height);
			lcmAfterWidthArr.push(lcmAfterItemWidth);
			lcmAfterAllWidth = (lcmAfterAllWidth * 1) + lcmAfterItemWidth;
		});

		var realWidthNum = 0;
		var parentWidthArr = [];

		var allData = [];

		// 计算 得到的宽高
		$.each(cartArr,function(i,item){

			// 当前元素 之前的 所有 div 宽度和
			var parent_width = 0;

			$.each(parentWidthArr,function(j,jItem){
				if (cartArr.length == 3) {
					console.dir(parentWidthArr[0]);
				}
				if (parentWidthArr[j]) {
					parent_width = parent_width * 1 + parentWidthArr[j] * 1;
				}
				// 
			});

			realHeight = (screen_width/lcmAfterAllWidth) * lcmNum;
			realWidth = (screen_width/lcmAfterAllWidth) * lcmAfterWidthArr[i];
			realWidthNum = realWidthNum + realWidth;

			parentWidthArr.push(realWidth);

			if (realHeight > item.height) {
				checkFlag = false;
			}else{
				nowData = [];
				nowData.push(realWidth, realHeight, (parent_width+(3*i)));
				allData.push(nowData);
			}

			// var parent_width = (i > 0) ? parentWidthArr[i-1] : 0;
			// if (cartArr.length == 3) {
				// var now_col_item_other = $(".main-content").find(".pic-item").eq(i);
				// // console.log(now_col_item_other);
				// now_col_item_other.css('width',realWidth+'px');
				// now_col_item_other.css('height',realHeight+'px');

				// now_col_item_other.css('left',(parent_width+(3*i))+'px');

				// now_col_item_other.css('top',top+'px');
			// }
			// console.log(realHeight);
			// console.log(realWidth);
		});
		// (screen_width/lcmAfterWidth) * nowHeightArr[0]

		if (checkFlag) {
			// 当前 cartArr 可以在一行
			console.log('check-yes');
			return allData;
		}else{
			// 失败 需要增加 新的 元素到数组
			console.log('check-no');
			// 
			return false;
		// if (cartArr.length == 3) { return false; }
		}
		console.log('-----------'+cartArr.length+' end '+'----------------');
		
	}

	// 更新布局
	function updateLayer(i, newData, top){
		console.log('-----------'+' updateLayer start '+'----------------');

		console.dir(i);
		console.dir(newData);
		// console.dir(top);
		// console.log((i-(newData.length-1)));
		// 
		var nowIndex = 0;
		for(var k = (i-(newData.length-1)); k <= i; k++){
			realWidth = newData[nowIndex][0];
			realHeight = newData[nowIndex][1];
			realLeft = newData[nowIndex][2];

			var now_col_item_other = $(".main-content").find(".pic-item").eq(k);
			// console.log(now_col_item_other);
			now_col_item_other.css('width',realWidth+'px');
			now_col_item_other.css('height',realHeight+'px');

			now_col_item_other.css('left',realLeft+'px');

			now_col_item_other.css('top',top+'px');
			nowIndex++;
		};

		console.log('-----------'+' updateLayer end '+'----------------');
	}

	// 构建布局
	function build(data){
		// 图片数据
		var _data = data;
		console.dir(data);
		// 每行的显示的个数
		var _cols_item_num = [2,3,4,1,4];

		var _item_height = 200;

		// margin 的像素值
		var margin_item = 3;

		// 容器的总宽度值
		var screen_width = $(".main-content").width();

		// var x = 0;
		// for (var i = 0; i < _cols_item_num.length; i++) {
		// 	var item_cols_count = _cols_item_num[i];

		// 	// 随机获取第一个的宽
		// 	var first_width = 400;

		// 	console.log(screen_width);

		// 	// 计算 需要抛去的margin 像素 ，并从容器宽度中抛去
		// 	var col_div_real_width = screen_width - (item_cols_count - 1) * margin_item;
		// 	console.log(col_div_real_width);

		// 	item_width = 0;
		// 	for (var j = 1; j < item_cols_count; j++) {
		// 		var parent_width = (item_width == 0) ? first_width : item_width;

		// 		item_width = col_div_real_width = col_div_real_width - parent_width;

		// 		var now_col_item_other = $(".main-content").find(".pic-item").eq(j);
		// 		console.log(item_width);

		// 		now_col_item_other.css('width',item_width+'px');
		// 		now_col_item_other.css('height',_item_height+'px');
		// 		now_col_item_other.css('left',(parent_width+margin_item*j)+'px');
		// 		x++;
		// 	}
		// 	x++;
		// 	return false;
		// }

		var cartArr = [];

		var top = 0;
		$.each(_data,function(i,item){
			// console.dir(screen_width);
			// console.dir(item.width);
			// console.dir(screen_width - item.width);
			if (cartArr.length) {
				// 当前 数据 于 之前的 不能单独成行的数据 验证 能否组成一行
				cartArr.push(item);

				// 验证是否能组成一行 并且 生成 响应的 宽高
				if (newData = checkCreateCol(screen_width, cartArr)) {
					// 成功 清空 cartArr
					console.dir('yes');
					console.dir(newData);

					// 进行布局 赋值
					updateLayer(i, newData, top);

					// 获取 当前行的 高度 为下一列 top 指定值
					top = top + newData[0][1] + margin_item;
					console.dir(top);
					cartArr = [];
					newData = [];
				}else{
					// 失败 继续添加 元素
					console.dir('no');
				}
				// if (cartArr.length == 3) { return false; }
			}else{
				if (screen_width > item.width + item.ratingMax) {
					// 屏幕比图片 原始大小 大
					console.dir('more');
					cartArr.push(item);
				}else{
					newData = [];
					oneCols = [];
					// 屏幕比图片 原始大小 小
					console.dir('all');

					// 计算单张图片 满屏的 真实高度
					onesHeight = (screen_width/item.width) * item.height;
					onesWidth = screen_width;
					onesLeft = 0;

					oneCols.push(onesWidth, onesHeight, onesLeft);

					newData.push(oneCols);

					// 进行布局 赋值
					updateLayer(i, newData, top);

					// 获取 当前行的 高度 为下一列 top 指定值
					top = top + onesHeight + margin_item;

					newData = [];
					oneCols = [];

					console.dir('all end');
				}	
			}
		});

	}

	init();

	// 窗口 大小 改变
	$(window).resize(function(){
		init();
	});

});