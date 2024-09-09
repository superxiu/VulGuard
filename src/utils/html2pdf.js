// import html2Canvas from 'html2canvas'
// import JsPDF from 'jspdf'
 
// const htmlToPdf = {
// //   isSplit (nodes, index, pageHeight) {
// //     // 计算当前这块dom是否跨越了a4大小，以此分割
// //     if (nodes[index].offsetTop + nodes[index].offsetHeight < pageHeight && nodes[index + 1] && nodes[index + 1].offsetTop + nodes[index + 1].offsetHeight > pageHeight) {
// //         return true;
// //     }
// //     return false;
// // },
//   getPdf (title) {　　// pdfDom 这个就是你vue页面中定义的ID  比如<div id="pdfDom">  这个也要避下雷
//     var element = document.getElementById('pdfDom')
//     window.pageYoffset = 0
//     document.documentElement.scrollTop = 0
//     document.body.scrollTop = 0　
//   // 我的需求暂时不按照此方式来切割  所以注释         const A4_WIDTH = 592.28;
//   //  const A4_HEIGHT = 841.89;
//   //  let pageHeight = element.scrollWidth / A4_WIDTH * A4_HEIGHT;
//   //   let lableListID = element.querySelectorAll(".el-table")
//   //   console.log(lableListID)
//   //     // 进行分割操作，当dom内容已超出a4的高度，则将该dom前插入一个空dom，把他挤下去，分割
//   //     for (let i = 0; i < lableListID.length; i++) {
        
//   //       // 解决当div刚好占满一页多时的思路 判断子节点是否在a4的最底部
//   //         // if () {

//   //         // }
//   //       // 当前div 若超过一页，则会新开一个页面（但是 当div刚好占满一页多时，问题不能够解决）
//   //       let multiple = Math.ceil((lableListID[i].offsetTop + lableListID[i].offsetHeight) / pageHeight);
//   //           if (this.isSplit(lableListID, i, multiple * pageHeight)) {
//   //               let divParent = lableListID[i].parentNode; // 获取该div的父节点
//   //               let newNode = document.createElement('div');
//   //                   newNode.className = 'emptyDiv';
//   //                   newNode.style.background = '#ffffff';
//   //               let _H = multiple * pageHeight - (lableListID[i].offsetTop + lableListID[i].offsetHeight);
//   //               //留白
//   //               // newNode.style.height = 30 + 'px';
//   //                   newNode.style.height = _H + 30 + 'px';
//   //                   newNode.style.width = '100%';
//   //                   let next = lableListID[i].nextSibling; // 获取div的下一个兄弟节点
//   //                     // 判断兄弟节点是否存在
//   //                   if (next) {
//   //                       // 存在则将新节点插入到div的下一个兄弟节点之前，即div之后
//   //                       divParent.insertBefore(newNode, next);
//   //                   }else{
//   //                       // 不存在则直接添加到最后,appendChild默认添加到divParent的最后
//   //                       divParent.appendChild(newNode);
//   //                   }
//   //             }
//   //     }

//     setTimeout(() => {
//         const nowDate = new Date();
//         const date = {
//           year: nowDate.getFullYear(),
//           month: nowDate.getMonth() + 1,
//           date: nowDate.getDate(),
//           hours: nowDate.getHours(),
//           minutes: nowDate.getMinutes(),
//           seconds: nowDate.getSeconds()
//         };
//         const newmonth = date.month > 10 ? date.month : "0" + date.month;
//         const newday = date.date > 10 ? date.date : "0" + date.date;
//         const newminutes = date.minutes < 10 ? "0" + date.minutes : date.minutes;
//         const newseconds = date.seconds < 10 ? "0" + date.seconds : date.seconds;
//         const value =
//           date.year +
//           newmonth +
//           newday +
//           date.hours +
//           newminutes +
//           newseconds;
//           let id = '1.23452384164.123412416';
//               //创建一个画布    ---  增加导出的pdf水印 ！！
//               let can = document.createElement('canvas');
//               //设置画布的长宽
//               can.width = 400;
//               can.height = 500;
          
//               let cans = can.getContext('2d');
//               //旋转角度
//               cans.rotate(-15 * Math.PI / 180);
//               cans.font = '18px Vedana';
//               //设置填充绘画的颜色、渐变或者模式
//               cans.fillStyle = 'rgba(200, 200, 200, 0.40)';
//               //设置文本内容的当前对齐方式
//               cans.textAlign = 'left';
//               //设置在绘制文本时使用的当前文本基线
//               cans.textBaseline = 'Middle';
//               //在画布上绘制填色的文本（输出的文本，开始绘制文本的X坐标位置，开始绘制文本的Y坐标位置）
//               cans.fillText(value, can.width / 8, can.height / 2);
//               let div = document.createElement('div');
              
//               div.id = id;
//               div.style.pointerEvents = 'none';
//               div.style.top = '20px';
//               div.style.left = '-20px';
//               div.style.position = 'fixed';
//               div.style.zIndex = '100000';
//               div.style.width = document.getElementById('pdfDom').scrollHeight + 'px';
//               div.style.height = document.getElementById('pdfDom').scrollHeight + 'px';
//               div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat';
//               document.getElementById("pdfDom").appendChild(div); // 到页面中
//         html2Canvas(element, {
//           allowTaint: true,
//           useCORS: true,
//           // scale: 2, // 提升画面质量，但是会增加文件大小　　　　　　// 需要注意，element的 高度 宽度一定要在这里定义一下，不然会存在只下载了当前你能看到的页面   避雷避雷！！！
//           height: document.getElementById('pdfDom').scrollHeight,
//           windowHeight: document.getElementById('pdfDom').scrollHeight
//         }).then(function (canvas) {
//           var contentWidth = canvas.width;
//           var contentHeight = canvas.height;
//           console.log("contentWidth", contentWidth)
//           console.log("contentHeight", contentHeight)
//           // 一页pdf显示html页面生成的canvas高度;
//           var pageHeight = contentWidth * 841.89 / 592.28;
//           // 未生成pdf的html页面高度
//           var leftHeight = contentHeight;
          
//           console.log("pageHeight", pageHeight)
//           console.log("leftHeight", leftHeight)
//           // 页面偏移
//           var position = 0;
//           // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
//           var imgWidth = 595.28;
//           var imgHeight = 592.28 / contentWidth * contentHeight;
  
//           var pageData = canvas.toDataURL('image/jpeg', 1.0);
  
//           var pdf = new JsPDF('', 'pt', 'a4');
  
//           // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
//           // 当内容未超过pdf一页显示的范围，无需分页
//           if (leftHeight < pageHeight) {
//             console.log("没超过1页")
//             pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
//           } else {
//             while (leftHeight > 0) {
//               console.log("超过1页")
//               pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
//               leftHeight -= pageHeight;
//               position -= 841.89;
//               // 避免添加空白页
//               if (leftHeight > 0) {
//                 pdf.addPage();
//               }
//             }
//           }
//           pdf.save(title + '.pdf');
          
//         });
//       }, 1000);
//   }
// }
 
// export default htmlToPdf

import html2Canvas from 'html2canvas';
import JsPDF from 'jspdf';

const htmlToPdf = {
  getPdf(title) {
    var element = document.getElementById('pdfDom');
    window.pageYOffset = 0;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    setTimeout(() => {
      html2Canvas(element, {
        allowTaint: true,
        useCORS: true,
        height: document.getElementById('pdfDom').scrollHeight,
        windowHeight: document.getElementById('pdfDom').scrollHeight
      }).then(function (canvas) {
        var contentWidth = canvas.width;
        var contentHeight = canvas.height;

        var pageHeight = contentWidth * 841.89 / 592.28;
        var leftHeight = contentHeight;
        var position = 0;
        var imgWidth = 595.28;
        var imgHeight = 592.28 / contentWidth * contentHeight;

        var pageData = canvas.toDataURL('image/jpeg', 1.0);

        var pdf = new JsPDF('', 'pt', 'a4');

        if (leftHeight < pageHeight) {
          pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
        } else {
          while (leftHeight > 0) {
            pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
            leftHeight -= pageHeight;
            position -= 841.89;
            if (leftHeight > 0) {
              pdf.addPage();
            }
          }
        }
        pdf.save(title + '.pdf');
      });
    }, 1000);
  }
};

export default htmlToPdf;
