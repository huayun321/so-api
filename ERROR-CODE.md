
# SENSORO ROOM API SERVER ERROR CODE
Server端返回的错误信息码。


---

## 错误码表格

错误码 | 错误信息 | 备注说明
--------- | ------------- | ------------- 
0001 | 无回调函数或回调函数格式错误 | 创建房间时必须传入回调函数作为参数
0101 | room.join,参数类型不匹配,options,应为Object类型. | 加入房间时的配置参数必须是object类
0102 | room.join参数类型不匹配,options,应有roomName字段. | 
0103 | room.join参数类型不匹配,options,roomName字段应为 6c84fb90-12c4-11e1-840d-7b25c5ee775a 格式. | 
0104 | room.join,不存在roomName所指定的房间,请换其他房间名. | 
0201 | room.broadcast,roomName,应为 6c84fb90-12c4-11e1-840d-7b25c5ee775a 格式. | 
0202 | room.broadcast,不存在roomName所指定的房间,请换其他房间名. | 
0301 | room.broadcastNum,roomName,应为 6c84fb90-12c4-11e1-840d-7b25c5ee775a 格式. | 
0302 | room.broadcastNum,不存在roomName所指定的房间,请换其他房间名. | 


