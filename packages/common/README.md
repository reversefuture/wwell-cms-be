# 发布NPM
1. 登录
> npm login
2. 配置package.json
- name：作用域包的名称格式为 @scope/package-name，这里是 @gcswwell/common。
- version：包的版本号，遵循 SemVer 规范，初始版本可以设置为 1.0.0。
- description：包的简要描述。
- main：包的入口文件。
每次发布包时，package.json 中的 version 字段必须是一个新的版本号，否则会发布失败。

3. 配置作用域
如果你要发布的是作用域包（以 @ 开头），需要确保在 package.json 中配置了正确的作用域，并且在 npm 中设置了该作用域的发布权限.

在项目根目录下创建或编辑 .npmrc 文件，添加以下内容：
> @gcswwell:registry=https://registry.npmjs.org/
这会告诉 npm 该作用域的包要发布到官方的 npm 注册表。

4. 建议先验证包的结构和依赖是否正确。可以运行以下命令进行验证：
>npm pack
这会在项目根目录下生成一个 .tgz 文件

5. 发布包：
>npm publish --access public