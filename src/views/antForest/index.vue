<template>
  <div class="integral-container">
    <Header></Header>
    <!-- 类蚂蚁森林 -->
    <div
      class="antForest-container"
      ref="antForest"
    >
      <template v-if="integralAvailabel && nodeList && nodeList.length > 0">
        <template v-if="nodeList && nodeList.length > 0">
          <div id = "antForest-ball__container">
            <div
              v-for="(ballItem, ballIndex) in nodeList"
              :key="ballIndex"
            >
              <!-- 多一层实现悬浮晃动效果 -->
              <div
                :id="`antForest-ball__item_${ballIndex}`"
                @click="clickIntegralBall(ballIndex, ballItem)"
              >
                <div class="antForest-ball__item">
                  <div class="ball-item__ball">
                    <span
                      class="ball-item__count"
                    >{{ballItem.scoreValue > 0 ? `+${ballItem.scoreValue}` : ballItem.scoreValue}}</span>
                  </div>
                  <div class="ball-item__type">{{ballItem.description}}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="antForest-container__totalTegral">
          <span class="totalTegral-num">0</span>
          <img
            v-if="showGetAllIcon"
            class="totalTegral-getAll__img"
            id="totalTegral-getAll__img"
            @click="clickGetAll"
            src="https://img1.tuhu.org/PeccancyCheXingYi/FobgTRJWhXW4LvPOA5xCVAmWG7Rr_w408_h128.png@100Q.png"
          />
        </div>
      </template>

      <div class="antForest-container__footer">积分试行期间，积分规则将会适时调整，带来不便敬请见谅</div>
    </div>
  </div>
</template>

<script>
// import { Component } from 'vue-property-decorator'
import Header from '@/components/header.vue'

export default {
  name: 'AntForest',
  data () {
    return {
      pageNo: 1,
      hasNextPage: true,
      integralAvailabel: true, // 有积分 ---> 展示积分球
      showGetAllIcon: false, // 显示【一键获取】
      nodeList: [],
      ballCenterPosList: [],
      viewW: 750,
      viewH: 532,
      distanceToBall: 85,
      distanceToTotal: 128, // 127.5
      totalCenterPos: {
        x: 375,
        y: 299
      }, // totalBall 球心坐标

      integralTypeIndex: 1,
      noMore: false,
      lock: false, // 防止同一page多次请求
      loading: true,
      totalCount: 0,
      integralList: [],

      mockList: [
        {
          'operationLogId': 2659,
          'scoreValue': 1,
          'description': '知识库'
        },
        {
          'operationLogId': 2662,
          'scoreValue': 1,
          'description': '知识库'
        },
        {
          'operationLogId': 2663,
          'scoreValue': 1,
          'description': '知识库'
        },
        {
          'operationLogId': 2675,
          'scoreValue': 1,
          'description': '知识库'
        },
        {
          'operationLogId': 2676,
          'scoreValue': 1,
          'description': '知识库'
        },
        {
          'operationLogId': 2679,
          'scoreValue': 1,
          'description': '知识库'
        },
        {
          'operationLogId': 2682,
          'scoreValue': 5,
          'description': '云学习'
        },
        {
          'operationLogId': 2683,
          'scoreValue': 5,
          'description': '云学习'
        },
        {
          'operationLogId': 2689,
          'scoreValue': 1,
          'description': '知识库'
        },
        {
          'operationLogId': 2690,
          'scoreValue': 1,
          'description': '知识库'
        }
      ]
    }
  },

  components: { Header },

  methods: {
    // 倒计时
    countDown () {
      this.timer = setTimeout(() => {
        this.showGetAllIcon = false
      }, 3000)
    },
    // 获取积分气泡列表 -- 此处模拟调接口，用的是mock数据
    async getIntegralBallList () {
      try {
        this.ballCenterPosList = [] // 重置nodeList
        this.nodeList = [...this.mockList]
      } catch (e) {}
    },
    // 绘制气泡墙
    createIntegralBallWall () {
      if (this.nodeList && this.nodeList.length > 0) {
        this.nodeList.forEach((item, index) => {
          const pos = this._getSingleIntegralBallCenter(this.ballCenterPosList)
          this.ballCenterPosList.push(pos)
          this._renderBallPos(index, pos)
        })
      }
    },
    // 渲染
    _renderBallPos (index, pos) {
      const antForestBallItem = document.getElementById(`antForest-ball__item_${index}`)
      if (antForestBallItem) {
        (antForestBallItem).className = 'antForest-ball__item_container';
        (antForestBallItem).style.opacity = '1';
        (antForestBallItem).style.position = 'absolute';
        (antForestBallItem).style.left = `${((pos.x - 42.5) / this.viewW) * 100}%`;
        (antForestBallItem).style.top = `${((pos.y - 42.5) / this.viewH) * 100}%` // 使用%定位
      }
    },
    // 递归获取气泡球心
    _getSingleIntegralBallCenter (arrList) {
      const currentArrList = []
      arrList.forEach((arrItem) => { // 过滤掉上一页的
        if (!arrItem.click) {
          currentArrList.push(arrItem)
        }
      })

      const _ballCenterPos = {
        x: this._rnd(0.1 * this.viewW, 0.9 * this.viewW),
        y: this._rnd(0.1 * this.viewH, 0.6 * this.viewH)
      }
      const _noCoverToTal = this._getDistanceForBallCenter(
        this.totalCenterPos,
        _ballCenterPos,
        this.distanceToTotal
      )
      if (_noCoverToTal) {
        if (currentArrList && currentArrList.length > 0) {
          let isFlag = true // 该pos是否全部不重合标志
          currentArrList.forEach(listItem => {
            const _noCover = this._getDistanceForBallCenter(
              listItem,
              _ballCenterPos,
              this.distanceToBall
            ) // 该pos是否与该ball不重合
            if (!_noCover) {
              isFlag = false
            }
          })
          if (isFlag) {
            return _ballCenterPos
          }
          return this._getSingleIntegralBallCenter(this.ballCenterPosList)
        }
        return _ballCenterPos
      }
      return this._getSingleIntegralBallCenter(this.ballCenterPosList)
    },

    /**
     * 判断两圆心之间距离是否大于直径 或者球心距totalBall球心距离小于
     * p1 -- 已创建可用Ball的ballList中item
     * p2 -- 当前创建ball
     * distanceToBall -- 两个ball球心之间最小距离
     */
    _getDistanceForBallCenter (p1, p2, distanceToBall) {
      const dx = Math.abs(p2.x - p1.x)
      const dy = Math.abs(p2.y - p1.y)
      const disToBall = Math.sqrt((dx ** 2) + (dy ** 2))
      return disToBall > distanceToBall
    },

    _rnd (n, m) {
      const random = Math.floor((Math.random() * (m - n + 1)) + n)
      return random
    },
    // 单击气泡
    clickIntegralBall (ballIndex, ballItem) {
      if (!this.getAllClicking && !ballItem.click) {
        this.singleClicking = true
        this.nodeList[ballIndex].click = true
        this.timer = setTimeout(() => {
          (document.getElementById(`antForest-ball__item_${ballIndex}`)).className = 'clickBall';
          (document.getElementById(`antForest-ball__item_${ballIndex}`)).style.opacity = '0'
        }, 300)
        const collectIntegralList = []
        collectIntegralList.push(ballItem.operationLogId)

        // ！！！不能remove Dom
        this.timer = setTimeout(() => {
          // const params = {
          //   operationLogIds: [...collectIntegralList]
          // }
          // this.collectIntegralBall(params);
        }, 500)
      } else {
        console.log('该积分已经领取过啦或者正在一键领取')
      }
    },
    // 一键领取
    clickGetAll () {
      if (!this.singleClicking) {
        this.getAllClicking = true
        const collectIntegralList = []
        for (let i = 0; i < this.nodeList.length; i++) {
          if (!this.nodeList[i].click) {
            this.nodeList[i].click = true
            collectIntegralList.push(this.nodeList[i].operationLogId)
            this.timer = setTimeout(() => {
              (document.getElementById(`antForest-ball__item_${i}`)).className = 'clickBall';
              (document.getElementById(`antForest-ball__item_${i}`)).style.opacity = '0'
            }, 300)
          } else {
            console.log('该积分已经领取过啦')
          }
        }

        this.timer = setTimeout(() => {
          // const params = {
          //   operationLogIds: [...collectIntegralList]
          // }
          // this.collectIntegralBall(params);
        }, 500)
      } else {
        console.log('正在单击')
      }
    }
  },
  created () {
  },
  async mounted () {
    await this.getIntegralBallList()
    this.createIntegralBallWall()
    if (this.nodeList && this.nodeList.length > 0) {
      this.showGetAllIcon = true
      this.countDown()
    }
  },
  destroyed () {
    clearTimeout(this.timer)
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
*{
  margin: none;
  padding: none;
}
.integral-container {
  width: 100%;
  min-height: 100vh;
  background-color: #edeef0;
}
.antForest-container {
  position: relative;
  top: 88px;
  width: 100%;
  height: 532px;
  background: url('https://img1.tuhu.org/PeccancyCheXingYi/Fr8SXH7WfDGq14H4jrhrwF0Fou2P_w800_h567.png@100Q.png')
    no-repeat center center;
  background-size: 100% 100%;
  border: none;

  // &.noIntegralAvailable {
  //   position: relative;
  //   width: 100%;
  //   height: 364px;
  // }

  .antForest-ball__item_container {
    position: absolute;
  }
  .antForest-ball__item {
    position: relative;
    animation: ballShaking 3s infinite;
    &.antForest-ball__item_right {
      animation: ballShakingRight 3s ease infinite alternate;
    }

    font-size: 28px;
    color: rgba(255, 255, 255, 1);
    line-height: 35px;

    .ball-item__ball {
      width: 85px;
      height: 85px;
      border-radius: 50%;
      box-sizing: border-box;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(49, 161, 255, 0.65) 100%);
      z-index: 999;

      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ball-item__type {
      margin-top: 8px;
      text-align: center;
      z-index: 1;
      font-size: 24px;
    }
  }
  .noIntegral-tip {
    position: absolute;
    width: 214px;
    height: 110px;
    left: 50%;
    transform: translateX(-50%);
    top: 98px;

    font-size: 22px;
    color: rgba(39, 49, 62, 1);

    .noIntegral-tip__topBox {
      position: absolute;
      top: 0;
      left: 0;
      width: 214px;
      height: 80px;
      padding: 12px;
      box-sizing: border-box;
      background: rgba(255, 255, 255, 1);
      border: 2px solid rgba(253, 220, 49, 1);
      border-radius: 5px;
    }
    .noIntegral-tip__bottomBox {
      position: absolute;
      // bottom: 0;
      top: 70px;
      left: 45%;
      transform: translateX(-50%);
      width: 20px;
      height: 20px;
      box-sizing: border-box;
      background: rgba(255, 255, 255, 1);
      // border:2px solid rgba(253,220,49,1);
      border-bottom: 2px solid rgba(253, 220, 49, 1);
      border-right: 2px solid rgba(253, 220, 49, 1);

      transform: rotate(45deg);
    }
  }
  .antForest-container__totalTegral {
    position: absolute;
    top: 214px;
    left: 50%;
    transform: translateX(-50%);
    width: 170px;
    height: 170px;
    background: url('https://img1.tuhu.org/PeccancyCheXingYi/Ft8A2xMk9jj4UfVcGOUd0dlEu7rn_w380_h380.png@100Q.png')
      no-repeat center center;
    background-size: 100% 100%;
    border: none;

    .totalTegral-num {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 36px;
      font-size: 56px;
      color: rgba(35, 61, 120, 1);
      line-height: 61px;
    }

    .totalTegral-getAll__img {
      width: 204px;
      height: 64px;

      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 182px;
    }
  }

  .myIntegral-info__container {
    position: absolute;
    // // position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 532px;
    padding: 0 32px;
    box-sizing: border-box;

    .myIntegral-info__top {
      margin-top: 88px;
      .personal-avatar_border {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 8px solid rgba(255, 255, 255, 0.15);
      }
      .myIntegral-info__personal_avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }
      .myIntegral-info__personal_title {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        font-size: 28px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 40px;
      }
      .myIntegral-info__title_img {
        width: 128px;
        height: 44px;
      }

      .myIntegral-info__integral {
        color: #fff;
        font-size: 24px;

        .myIntegral-info__integral_count {
          font-size: 80px;
          color: rgba(255, 215, 84, 1);
          line-height: 87px;
        }
      }
    }
    .myIntegral-info__progress {
      margin-top: 64px;
      width: 100%;

      .myIntegral-info__progress_p {
        width: 100%;
        height: 16px;
        background: rgba(255, 255, 255, 0.4);
        opacity: 0.85;
        color: linear-gradient(90deg, rgba(252, 214, 146, 1) 0%, rgba(248, 172, 89, 1) 100%);
        border-radius: 12px;
      }
      progress::-webkit-progress-bar {
        opacity: 0.85;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 12px;
      }
      progress::-webkit-progress-value {
        background: linear-gradient(90deg, rgba(252, 214, 146, 1) 0%, rgba(248, 172, 89, 1) 100%);
        border-radius: 12px;
      }
      progress::-moz-progress-bar {
        opacity: 0.85;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 12px;
      }
      progress::-moz-progress-value {
        background: linear-gradient(90deg, rgba(252, 214, 146, 1) 0%, rgba(248, 172, 89, 1) 100%);
        border-radius: 12px;
      }

      .myIntegral-info__progress_value {
        margin-top: 12px;
        font-size: 32px;
        color: rgba(255, 255, 255, 1);
        line-height: 35px;
      }
    }
  }

  .antForest-container__footer {
    position: absolute;
    // top: 434px;
    bottom: 60px;
    width: 100%;
    text-align: center;

    font-size: 22px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
    line-height: 30px;
  }
}

.clickBall {
  animation: ballClick 3s ease;
}
.clickGetAll {
  transition: getAllClick 5s ease;
}
.content-item__name_txt{
  width: 120px;
}

@keyframes ballShaking {
  0% {
    position: relative;
    top: 0;
  }
  50% {
    position: relative;
    top: 10px;
  }
  100% {
    position: relative;
    top: 0px;
  }
}
@keyframes ballShakingRight {
  0% {
    position: relative;
    top: 0;
  }
  50% {
    position: relative;
    top: 5px;
  }
  100% {
    position: relative;
    top: 0;
  }
}
@keyframes ballClick {
  0% {
    position: absolute;
    opacity: 1;
  }
  50% {
    position: absolute;
    opacity: 0.4;
  }
  75% {
    position: absolute;
    opacity: 0.1;
  }
  100% {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
  }
}
@keyframes getAllClick {
  0% {
    opacity: 0.8;
    width: 163.2px;
    height: 51.2px;
    width: 204px;
    height: 64px;

    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 182px;
  }
  50% {
    opacity: 0.4;
    width: 102px;
    height: 32px;

    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 182px;
  }
  75% {
    opacity: 0.1;
    width: 40.8px;
    height: 12.8px;

    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 182px;
  }
  100% {
    opacity: 0;
    width: 0px;
    height: 0px;

    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 182px;
  }
}

</style>
