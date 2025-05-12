# pmpm
Can refer: https://github.com/nuxt/nuxt/blob/main/package.json
## commands
pnpm install
pnpm add <pkg>
pnpm remove
pnpm <cmd>
pnpm up foo@2
pnpm up --latest # update all
pnpm run watch # run package.json script watch

onnxruntime-node

### 更新根目录的 axios
在项目根目录下运行：
>pnpm up axios --latest

更新 core workspace 的 axios
>pnpm up axios --latest --filter=core

更新所有 workspaces 的 axios
> pnpm up axios --latest --recursive
or:
>pnpm up axios --latest -r

同时更新根目录和 core 的 axios, filter两次
>pnpm up axios --latest --filter=./ --filter=core