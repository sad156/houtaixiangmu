<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" style="background:#00c0ef;cursor:auto" @click="handleSetLineChartData('newVisitis')">
        <!-- <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div> -->
        <div class="card-panel-description" style="cursor:auto">
          <div class="card-panel-text">
            新订单
          </div>
          <count-to :start-val="0" :end-val="900" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" style="background:#00a65a;cursor:auto">
        <!-- 点击切换折线图 -->
        <!-- @click="handleSetLineChartData('messages')" -->

        <!-- <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div> -->
        <div class="card-panel-description" style="cursor:auto">
          <div class="card-panel-text">
            一周支付金额
          </div>
          <count-to :start-val="0" :end-val="37103" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" style="background:#f39c12;cursor:auto">
        <!-- 点击切换折线图 -->
        <!-- @click="handleSetLineChartData('purchases')" -->

        <!-- <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div> -->
        <div class="card-panel-description" style="cursor:auto">
          <div class="card-panel-text">
            一周新增用户
          </div>
          <count-to :start-val="0" :end-val="25" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" style="background:#dd4b39;cursor:auto">
        <!-- 点击切换折线图 -->
        <!-- @click="handleSetLineChartData('shoppings')" -->

        <!-- <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="shopping" class-name="card-panel-icon" />
        </div> -->
        <div class="card-panel-description" style="cursor:auto">
          <div class="card-panel-text">
            一周新增订单
          </div>
          <count-to :start-val="0" :end-val="23" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      font-weight: bold;
      margin: 26px 0;
      display: flex;
      flex-direction: column-reverse;
      align-items: center;

      .card-panel-text {
        line-height: 18px;
        color: #fff;
        font-size: 13px;
        margin-top: 21px;
      }

      .card-panel-num {
        font-size: 29px;
        color:#ffff;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
