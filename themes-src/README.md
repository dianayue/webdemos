# 使用 Docker 的 Wordpress



## 配置说明

- ***docker-compose.yml*** 文件将开启一个 wordpress 服务和一个独立的 MySQL 实例
- ./.env 文件为 wordpress 应用变量
- ./config 目录为应用的配置映射目录
- ./themes 目录为 wordpress 的主题映射目录



## 构建运行

#### 运行项目
```sh
docker compose up -d
```

#### 停止项目
```sh
docker compose down
```
