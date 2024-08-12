<div align="center">
<h1>Rooch Anki</h1>
</div>

Rooch Anki 是一个基于 Rooch 的仿 Anki Web App，利用 Rooch Object 定义后端数据结构，利用 Rooch Session 得到接近 Web2 应用的体验。

![Rooch Anki](https://github.com/user-attachments/assets/8f063121-761c-4bdd-bc91-decc8e92c446)

Anki 是一个开源的记忆卡片学习应用，即使你没有用过，也可能在其他背单词软件中见过它的影子。它模拟真实抽认卡片的学习方式，**每张卡片都有正面和背面**，正面是问题，背面是答案。用户可以根据自己的熟悉程度选择卡片的状态，系统会根据用户的选择调整下次复习的时间。

在 Anki 的记忆算法中，卡片有多种状态：

- 新卡片（New）
- 学习中（Learning）
- 复习中（Review）
- 重新学习（Relearning）

为了简化实现，第一个版本中只实现了 Review 状态，模拟了最核心的 Anki 算法：**间隔重复**的简单版。每天用户会得到当天需要复习的卡片，用户自己选择熟悉程度，系统会根据用户的选择调整下次复习的时间。

## 核心概念

### Deck

卡组，一个卡组包含多张卡片（Card）。

### Card

卡片，一个卡片包含正面（Front）和背面（Back）。卡片带有下面三个核心参数：

- 容易程度（Ease Factor）：数值越高，表示卡片越熟悉。
- 复习间隔（Interval）：表示卡片下次复习的开始日期距离今天的天数。
- 下次复习的开始日期（Due Date）：只有现在的日期在 Due Date 之后，开始学习时卡片才会进入复习列表。

### 熟悉程度

卡片在复习时，用户需要选择熟悉程度，熟悉程度有 4 个等级：

- 完全不熟悉（Again）
- 有点熟悉（Hard）
- 一般熟悉（Good）
- 很熟悉（Easy）

选择不同的熟悉程度，会影响卡片的容易程度（Ease Factor）和复习间隔（Interval）。

## 如何使用

### 添加卡片

https://github.com/user-attachments/assets/478b0bb4-b43e-4afc-aecc-50af7ea26a05

### 复习卡片

https://github.com/user-attachments/assets/bf523147-1b3f-4d8c-9692-d63dd51fc5f9

### 查看卡片状态

点击 Deck 名称可以进入 Deck 详情页，看到 Deck 下面所有卡片的状态和参数，包括：

- 正面（Front）
- 背面（Back）
- 复习间隔（Interval）
- 已经复习了几次（Review Count）
- 容易程度（Ease Factor）
- 下次复习的开始日期（Due Date）
- 创建时间（Created At）

https://github.com/user-attachments/assets/abdc34b8-5325-4c53-abc1-561e195d4488

### 创建 Session

当你连接钱包之后，连接钱包按钮会变成创建 Session 按钮。如果你在连接钱包后还没创建
Session 就试图操作 Card 和 Deck，系统会引导你创建 Session。

https://github.com/user-attachments/assets/84bab27e-557b-4b44-8889-0fc56dac1302
