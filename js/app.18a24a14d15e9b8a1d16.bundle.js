(self.webpackChunk=self.webpackChunk||[]).push([[524],{44:(e,t,s)=>{const a=s(89),o=s(863),{lightningChart:n,SolidFill:r,SolidLine:l,UILayoutBuilders:i,UIElementBuilders:d,AutoCursorModes:c,AxisTickStrategies:x,emptyLine:m,emptyFill:u,AxisScrollStrategies:S,Themes:p}=a,{createProgressiveTraceGenerator:h}=o,g=new Date(2018,0,1),y=g.getTime(),T=["Dev","Maintenance","Support","Sales","Marketing"],w=864e5,k=Promise.all(T.map(((e,t)=>h().setNumberOfPoints(365).generate().toPromise().then((e=>e.map((e=>({x:y+e.x*w,y:t>0?100*Math.abs(e.y)+100:50*Math.abs(e.y)+1800}))))).then((e=>e.map((e=>({x:e.x-y,y:e.y})))))))),f=n().Dashboard({theme:p[new URLSearchParams(window.location.search).get("theme")||"darkGold"]||void 0,numberOfRows:3,numberOfColumns:2}),D=f.getTheme(),E=new l({thickness:20/window.devicePixelRatio,fillStyle:new r({color:D.examples.unfocusedDataColor})}),I=new r({color:D.examples.mainDataColor}),F=k.then((e=>e.map((e=>e.reduce(((e,t)=>e+t.y),0))))),C=f.createChartXY({columnIndex:0,rowIndex:0,columnSpan:1,rowSpan:2}).setAutoCursorMode(c.disabled).setTitle("Total expenses for 2018 per department").setMouseInteractions(!1),P=C.getDefaultAxisX();P.setTickStrategy(x.Empty).setMouseInteractions(!1).setInterval({start:0,end:100}).setScrollStrategy(void 0),C.getDefaultAxisY().setTitle("Expenses ($)").setStrokeStyle((e=>e.setThickness(0))).setNibStyle(m).setMouseInteractions(!1);const R=C.addSegmentSeries().setHighlightOnHover(!1),b=T.length+1,A=T.map(((e,t)=>P.addCustomTick().setTextFormatter((t=>e)).setValue(100/b*(t+1)).setGridStrokeStyle(m))),M=f.createChartXY({columnIndex:0,rowIndex:2,columnSpan:2,rowSpan:1}).setPadding({right:40});f.setRowHeight(2,2);const v=M.addLineSeries().setName("Total Expenses").setStrokeStyle((e=>e.setFillStyle(I)));M.getDefaultAxisX().setTickStrategy(x.DateTime,(e=>e.setDateOrigin(g))),k.then((e=>{const t=e.reduce(((e,t)=>t.reduce(((e,t)=>e>t.y?e:t.y),e)),0);M.getDefaultAxisY().setTitle("Expenses ($)").setScrollStrategy(S.fitting).setInterval({start:0,end:t,stopAxisAfter:!1})})),v.setCursorResultTableFormatter(((e,t,s,a)=>e.addRow("Total expenses").addRow("Date: "+t.axisX.formatValue(s)).addRow("Expenses: $"+a.toFixed(2)))),Promise.all([F,k]).then((([e,t])=>{const s=A.map(((t,s)=>{const a=t.getValue();return R.add({startX:a,startY:0,endX:a,endY:e[s]})})),a=e=>{M.setTitle(`${T[e]} expenses per day`),v.clear(),v.add(t[e]),s.forEach((e=>e.setStrokeStyle(E))),A.forEach((e=>e.setMarker((e=>e.setTextFont((e=>e.setWeight("normal"))))))),s[e].setStrokeStyle((e=>e.setFillStyle(I))),A[e].setMarker((e=>e.setTextFont((e=>e.setWeight("bold")))))};s.forEach(((e,t)=>{e.onMouseEnter((()=>a(t))),e.onTouchStart((()=>a(t)))})),a(0)}));const X=f.createUIPanel({columnIndex:1,rowIndex:0,columnSpan:1,rowSpan:1}).addUIElement(i.Column).setPosition({x:50,y:50}).setPadding({right:40}).setBackground((e=>e.setFillStyle(u).setStrokeStyle(m)));F.then((e=>{const t=X.addElement(i.Row);t.addGap(),t.addElement(d.TextBox.addStyler((t=>t.setTextFont((e=>e.setSize(75/window.devicePixelRatio))).setText("$"+e.reduce(((e,t)=>e+t),0).toFixed())))),t.addGap(),X.addElement(d.TextBox.addStyler((e=>e.setTextFont((e=>e.setSize(25/window.devicePixelRatio))).setText("Total company expenses"))))}));const O=f.createChartXY({columnIndex:1,rowIndex:1,columnSpan:1,rowSpan:1}).setTitle("Total expenses per day").setPadding({right:40});O.getDefaultAxisX().setTickStrategy(x.DateTime,(e=>e.setDateOrigin(g)));const Y=O.addSplineSeries().setName("Total Expenses ($)").setStrokeStyle((e=>e.setThickness(2)));k.then((e=>{const t=new Array(365);for(let s=0;s<365;s++)t[s]={x:s*w,y:T.reduce(((t,a,o)=>t+e[o][s].y),0)};Y.setPointFillStyle(u).add(t)})),Y.setCursorResultTableFormatter(((e,t,s,a)=>e.addRow("Total expenses").addRow("Date: "+t.axisX.formatValue(s)).addRow("Expenses: $"+a.toFixed(2)))),O.getDefaultAxisY().setTitle("Expenses ($)")}},e=>{e.O(0,[502],(()=>(44,e(e.s=44)))),e.O()}]);