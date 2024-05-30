# Deployment Maturity Dashboard ft. HACK WEEK 2024


<p align="center">
  <a href="https://github.com/CIPHERTron/hackweek-24">
    <img style="width: 750px; height: auto;" src="https://res.cloudinary.com/pritish007/image/upload/v1717051595/Screenshot_2024-05-30_at_12.16.20_PM_glsrkx.png">
  </a>

  <p>Adoption Maturity Dashboard - Our solution caters to two personas i.e. customer sponsor and technical program managers to drive effective adoption.</p>
</p>

<!-- TABLE OF CONTENTS -->
  <ol>
  <li>
      <a href="#about-the-project">Problem Statement</a>
  </li>
  <li>
      <a href="#getting-started">Proposed Solution</a>
  </li>
  <li>
      <a href="#performance">Business Impact</a>
  </li>
  <li>
      <a href="#screenshots">Future Scope</a>
  </li>
  </ol>

## ℹ️ Problem Statement

#### For Enterprise Organizations that are spanning across multiple business units/orgs, It is very difficult to drive adoption due to following challenges.

- There is no way to set the standard best practices that each business unit/orgs/departments adheres to
- No visibility for the executive to understand, where each business unit is in terms of their deployment journey, where are the gaps are and what are the things that need to be addressed to ensure that there is standardization and how far behind a company is in terms of their vision.
- No healthy competition between business units to learn from each other, thus impacting the adoption progress.  
- Difficult for adoption team to understand the challenges of each business unit and create a data driven adoption plan.

#### Target Personas

- Customer Sponsor, Executives
- Harness Adoption Team

## 🛠️ Proposed Solution

- To configure the score cards with a set of rules at an account level to calculate the score for each org and project to get insights on adoption maturity for a business unit that is deploying to production.
> Note: Score Cards will only be applicable to the pipelines that are deploying to prod.

- Create dashboard to present the adoption maturity insights to drive the change management, standardization and adoption.
          
a) Leadership board with top 5/7 performing units/teams to drive healthy competition and keep leaders in check on how to improve further.
b) To show visibility into those projects that are not deploying to production, where there are no pipelines, no services.

<img style="width: 750px; height: auto;" src="https://res.cloudinary.com/pritish007/image/upload/v1717052822/Screenshot_2024-05-30_at_11.42.51_AM_scuy7b.png">
<img style="width: 750px; height: auto;" src="https://res.cloudinary.com/pritish007/image/upload/v1717052737/Screenshot_2024-05-30_at_11.41.30_AM_gytnsi.png">
<img style="width: 750px; height: auto;" src="https://res.cloudinary.com/pritish007/image/upload/v1717052817/Screenshot_2024-05-30_at_11.42.01_AM_c6hzww.png">


### Demo Video

https://res.cloudinary.com/dy2w4vpse/video/upload/v1717050991/hackathon/projects/hack-week-2024-1/K3j1jVg3Y/crsbrvc3mqqfa8yfv4fq.mp4

### 🛠️ Built With

Following technologies and libraries are used for the development of this
project.

- [Next.js 14](https://nextjs.org/)
- [React Ace](https://github.com/securingsincity/react-ace)
- [Express.js](https://expressjs.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [TypeScript](https://www.typescriptlang.org/)


## Business Impact

<img style="width: 750px; height: auto;" src="https://res.cloudinary.com/pritish007/image/upload/v1717052898/Screenshot_2024-05-30_at_11.46.11_AM_mmaqnx.png">
<img style="width: 750px; height: auto;" src="https://res.cloudinary.com/pritish007/image/upload/v1717052898/Screenshot_2024-05-30_at_11.48.22_AM_ymeatw.png">



### Prerequisites

- [Node.js](https://nodejs.org/en/download/)

```sh
# Homebrew
brew install nodejs

# Sudo apt
sudo apt install nodejs

# Packman
pacman -S nodejs

# Module Install
dnf module install nodejs:<stream> # stream is the version

# Windows (chocolaty)
cinst nodejs.install
```

- [Yarn](https://classic.yarnpkg.com/en/docs/install/)

```sh
  npm install --global yarn
```

- [Git](https://git-scm.com/downloads)

```sh
  # Homebrew
  brew install git

  # Sudo apt
  apt-get install git

  # Packman
  pacman -S git

  # Module Install (Fedora)
  dnf install git

```

### 🤖 Running the project.

1. **Fork** and **clone** the project to your local system, cd into project
2. cd client and run

```shell
yarn install
yarn dev
```
3. cd server and run

```shell
yarn install
yarn start
```
3. Open _localhost:3000_ to view the frontend & _localhost:4567_ to view backend


