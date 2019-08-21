import koaRouter from 'koa-router';
import jwt from 'jsonwebtoken';
import * as userModel from '../mysql/user';
import * as config from '../utils/config';
const router = new koaRouter();
const createToken = (info:UserTypes.Model)=>{
  return jwt.sign(
    {
      nickname: info.nickname,
      id: info.id,
    } as UserTypes.Jwt,
    config.secret,
    { expiresIn: '2h' },
  )
}
// 注册
interface registerParams {
  tel: UserTypes.Model['tel'];
  password: UserTypes.Model['password'];
}
router.post('/register', async ctx => {
  const params: registerParams = ctx.request.body;
  if (!params.tel || !params.password) {
    return (ctx.body = {
      success: false,
      message: '参数不合法',
    });
  }
  const result = await userModel.addOne({
    tel: params.tel,
    password: params.password,
    nickname: '未命名'
  });
  if (result !== null) {
    const token = createToken(result);
    ctx.body = {
      data: { token, info: jwt.decode(token) },
      msg: '登录成功',
    };
  } else {
    ctx.body = {
      success: false,
      msg: '注册失败',
    };
  }
});
// 登录
interface loginParams {
  id: UserTypes.Model['id'];
  password: UserTypes.Model['password'];
}
router.post('/login', async ctx => {
  // // 设置 cookie
  // ctx.cookies.set('token', 'bill', {
  //   expires: new Date(), // 时间
  //   path: '/', // 路径
  //   domain: '0.0.0.0', // 域
  //   httpOnly: true, // 禁止js获取
  // });
  const params: loginParams = ctx.request.body;
  if (!params.id || !params.password) {
    return (ctx.body = {
      success: false,
      message: '参数不合法',
    });
  }
  const result = await userModel.findOne({
    id: params.id,
    password: params.password,
  });
  if (result !== null) {
    const token = createToken(result);
    ctx.body = {
      data: { token, info: jwt.decode(token) },
      msg: '登录成功',
    };
  } else {
    ctx.body = {
      success: false,
      msg: '用户名或密码错误',
    };
  }
});

// 注销
router.post('/logout', async ctx => {
  console.log(ctx.state.user);
  ctx.body = { OK: true };
});

// 获取信息
router.get('/userInfo', ctx => {
  const token = ctx.header.authorization;
  ctx.body = {
    data: { token: token, user: ctx.state.user },
  };
  //使用jwt-simple自行解析数据
  //  let payload = jwt.decode(token.split(' ')[1], jwtSecret);
  //   console.log(payload)
});

// 跟新
type updateParams = Partial<UserTypes.Model>;
router.post('/update', async ctx => {
  const params: updateParams = ctx.request.body;
  const result = await userModel.updateOne(params,{id:ctx.state.user.id});
  if (result !== null) {
    const token = createToken(result);
    ctx.body = {
      data: { token, info: jwt.decode(token) },
      msg: '更新成功',
    };
  } else {
    ctx.body = {
      success: false,
      msg: '更新失败',
    };
  }
});

module.exports = router;
