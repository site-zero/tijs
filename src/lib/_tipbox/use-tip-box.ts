import _ from 'lodash';
import { createApp } from 'vue';
import { TextSnippetProps } from '../../';
import { TiRawCom, Vars } from '../../_type';
import { Dom, Rects, tiCheckComponent } from '../../core';
import { TipTarget } from './lib-tip-types';

const TipBoxVars = {
  space: '10px',
};

export function drawTipBox(tip: TipTarget) {
  console.log('draw tip', tip.target, tip);

  let { dockMode = 'H' } = tip;
  // 获取一下参考对象的矩形区域
  let win = Rects.createBy(tip.target.ownerDocument);
  let ref = Rects.createBy(tip.target);

  // 计算目标绝对定位点
  let boxSty = {} as Vars;
  let conSty = { position: 'relative', background:'#FF0' } as Vars;
  let quad = win.getQuadrant(ref);

  // 停靠在水平边，则默认先放到上面
  // 等 dom 渲染后，就能知道地方够不够了
  if ('H' == dockMode) {
    boxSty.padding = 'var(--tb-space) 0';
    // 左侧，则定位在目标对象左上对齐
    if (/left$/.test(quad)) {
      boxSty.left = ref.left;
      boxSty.bottom = win.height - ref.top;
    }
    // 右侧，定位在目标对象右上对齐
    else {
      boxSty.right = win.width - ref.right
      boxSty.bottom = win.height - ref.top;
    }
  }
  // 对于垂直边则就看参考对象的位置
  else {
    // 左侧，则定位在目标对象右侧
    if (/left$/.test(quad)) {
      boxSty.left = ref.right;
      boxSty.top = ref.top;
    }
    // 右侧，定位在目标对象左侧
    else {
      boxSty.right = win.width - ref.left;
      boxSty.top = ref.top;
    }
  }

  _.assign(boxSty, {
    position: 'fixed',
    minHeight: '10px',
    minWidth: '50px',
  });
  console.log('css', boxSty);

  // 确保 body 下面有 tip 的插槽
  let body = tip.target.ownerDocument.body;
  let wrap = Dom.find('div.ti-tip-wrapper', body);
  if (!wrap) {
    let wrapStyle = _.mapKeys(TipBoxVars, (_v, k) => {
      return `--tb-${k}`;
    });
    console.log('!!!!!!!!!!!!!', wrapStyle);
    wrap = Dom.createElement({
      tagName: 'DIV',
      className: 'ti-tip-wrapper',
      style: wrapStyle,
      $p: body,
    });
  }

  // 准备一个 HTML
  let uniqId = [tip.appId, tip.comId, tip.id].join(':');
  let $tipbox = Dom.find(`[tip-uniq-id='${uniqId}']`, wrap);

  // 已经有了
  if ($tipbox) {
    return;
  }

  // 那么就创建对应的元素
  $tipbox = Dom.createElement({
    tagName: 'DIV',
    className: 'ti-tipbox',
    attrs: {
      'tip-uniq-id': uniqId,
    },
    style: boxSty,
    $p: wrap,
  });
  let $tipcon = Dom.createElement({
    tagName: 'DIV',
    className: 'tipbox-con',
    style: conSty,
    $p: $tipbox,
  });

  // 准备显示控件
  let rawCom: TiRawCom;
  let comConf: Vars;
  if (tip.comType) {
    rawCom = tiCheckComponent(tip.comType).com;
    comConf = tip.comConf ?? {};
  } else {
    rawCom = tiCheckComponent('TiTextSnippet').com;
    comConf = {
      text: tip.content,
      textType: tip.contentType,
      autoI18n: true,
    } as TextSnippetProps;
  }

  let app = createApp(rawCom, comConf);
  app.mount($tipcon);

  // 很好，现在显示了对象，需要针对显示的对象进行调整

  // 调整完毕了，那么就可以真正显示出来了
}
