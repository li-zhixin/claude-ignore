# 发布流程

## 前提条件
- 确保有 npm 发布权限
- GitHub Actions 已配置 `NPM_TOKEN` secret

## 发布步骤

1. **确保本地代码已提交**
   ```bash
   git status  # 检查工作区状态
   git add .
   git commit -m "your commit message"
   ```

2. **推送代码到远程仓库**
   ```bash
   git push
   ```

3. **创建并推送版本 tag**

   查看当前最新版本：
   ```bash
   git tag --sort=-v:refname | head -5
   # 或
   npm view claudeignore version
   ```

   创建新版本 tag（版本号递增）：
   ```bash
   git tag v0.0.9  # 根据当前版本递增
   git push origin v0.0.9
   ```

4. **自动发布流程**

   推送 tag 后，GitHub Actions 会自动：
   - 触发 `.github/workflows/release.yml` workflow
   - 从 tag 提取版本号
   - 更新 `package.json` 的 version 字段
   - 构建项目
   - 发布到 npm

5. **验证发布**

   查看 workflow 运行状态：
   ```bash
   gh run list --workflow=release.yml --limit 3
   # 或
   gh run watch <run-id>
   ```

   验证 npm 包版本：
   ```bash
   npm view claudeignore version
   ```

## 注意事项

- tag 格式必须是 `v` 开头，如 `v0.0.9`
- 每个 tag 只能发布一次，如需重新发布需要删除 tag 并重新创建
- workflow 会自动更新 package.json 中的版本号，无需手动修改
- npm 发布后可能需要几分钟才能在 npm registry 中生效
