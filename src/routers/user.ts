import koaRouter from 'koa-router';
import jwt from 'jsonwebtoken';
import * as userModel from '@database/user';
import * as config from '@utils/config';
const router = new koaRouter();
// 注册
router.post('/register', async ctx => {
  ctx.body = { OK: true };
});
// 登录
router.post('/login', async ctx => {
  // // 设置 cookie
  // ctx.cookies.set('token', 'bill', {
  //   expires: new Date(), // 时间
  //   path: '/', // 路径
  //   domain: '0.0.0.0', // 域
  //   httpOnly: true, // 禁止js获取
  // });
  // ctx.body = { OK: true };
  const data = ctx.request.body;
  if (!data.id || !data.password) {
    return (ctx.body = {
      code: 1,
      success: false,
      message: '参数不合法',
    });
  }
  const result = await userModel.findOne({
    id: data.id,
    pwd: data.password,
  });
  if (result !== null) {
    const token = jwt.sign(
      {
        name: result.nickname,
        id: result.id,
      },
      config.secret,
      { expiresIn: '2h' },
    );
    return (ctx.body = {
      data: { token, info: jwt.decode(token) },
      msg: '登录成功',
    });
  } else {
    return (ctx.body = {
      code: 1,
      success: false,
      msg: '用户名或密码错误',
    });
  }
});

// 注销
router.post('/logout', async ctx => {
  ctx.body = { OK: true };
});

router.get('/userInfo', ctx => {
  const token = ctx.header.authorization;
  ctx.body = {
    data: { token: token, user: ctx.state.user },
  };
  //使用jwt-simple自行解析数据
  //  let payload = jwt.decode(token.split(' ')[1], jwtSecret);
  //   console.log(payload)
});

module.exports = router;
