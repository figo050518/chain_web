export const errCode = {
    '-2': '服务器异常',
    '-1': '请求超时，请稍后再试',

    '101': 'body解析失败',
    '103': '请求格式错误',
    
    '201': '查询失败',
    '202': '数据不存在',
    '203': '数据已存在，请勿重复操作',

    '301': '校验验证码失败',
    '302': '验证码不匹配',
    '303': '注册失败',
    '304': '发送验证码失败',
    '305': '退出失败',
    '306': '用户不存在',
    '307': '密码错误',
    '310': '录入信息失败',
    '312': '邮箱已存在',

    '401': '商品录入失败',
    '404': '该商品已绑定批次，不能删除',
    '409': '商品已存在，请无重复添加',

    '504': '批次已激活',

    '909': '模板已存在',
    '910': '同一产品的模板名不能重复',

    '1104': '小程序模板不存在',
}