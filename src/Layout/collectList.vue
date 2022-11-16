<template>
  <div class="drawer-container height-full ">
    <div class="height-full ">
      <h3 class="drawer-title">
        收藏
      </h3>
      <ul class="height-full content-area">
        <li class="liest-item" v-for="item in listArr" :key="item.id">
          <div :class="'moudle' + item.type" @click="goDetail(item)">
            {{ typeIdArr[item.type - 1] }}
          </div>
          <div class="name" @click="goDetail(item)">{{ item.title }}</div>
          <div class="time">{{ $format(item.date) }}</div>
          <div class="cancel-collect" @click="cancelCollect(item)">取消收藏</div>
        </li>
        <div v-if="listArr.length < 1" class="no-data">
          暂无数据
        </div>
      </ul>
      <div class="more-btn">
        <el-button class="btn" @click="clickMore">查看更多</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import { CollectModule } from '@/store/modules/collect'
import { CollectApi } from '@/api/collect'
@Component({
  name: 'CollectList'
})
export default class CollectList extends Vue {
  private isCancel = false
  private typeIdArr = ['通知', '公文', '案卷', '事务']
  get listArr() {
    return CollectModule.listData
  }
  // 将日期转化为标准时间格式
  cancelCollect(item: any) {
    CollectApi.collectionDeleteApi({ ids: item.id }).then(() => {
      CollectApi.collectionApi({ pageIndex: 1, pageSize: this.$globalProps.pageSize }).then((res: any) => {
        this.$nextTick(() => {
          CollectModule.SetListData(res.data.records)
        })
      })
    })
  }

  clickMore() {
    SettingsModule.ChangeSetting({ key: 'showRightPanel', value: false, type: 2 })
    this.$router.push({ path: '/collect' })
  }
  goDetail(item: any) {
    switch (item.type) {
      case 1:
        // 内部通知
        this.$opener('message', { moduleKey: item.bookmarkId })
        break
      case 2:
        // 公文
        this.$opener('doc', { moduleKey: item.bookmarkId })
        break
      case 3:
        // 案卷
        this.$opener('op', { moduleKey: item.bookmarkId })
        break
      case 4:
        if (item.keyTypeCode === 1) {
          // 综合事务
          this.$opener('process', { moduleKey: item.bookmarkId })
        } else {
          // 督办事务
          this.$opener('supervise', { moduleKey: item.bookmarkId })
        }
        break
      default:
        break
    }
    SettingsModule.ChangeSetting({ key: 'showRightPanel', value: false, type: 2 })
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 12px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
  }
  .content-area {
    overflow: auto;
    padding-bottom: 80px;
  }
  .liest-item {
    display: flex;
    padding: 10px;
    .moudle1 {
      color: #3781ff;
      border: solid 1px #3781ff;
    }
    .moudle2 {
      color: rgb(255, 105, 0);
      border: solid 1px rgb(255, 105, 0);
    }
    .moudle3 {
      color: #f54287;
      border: solid 1px #f54287;
    }
    .moudle4 {
      color: #45cdf5;
      border: solid 1px #45cdf5;
    }

    > div:nth-of-type(1) {
      width: 40px;
      height: 18px;
      text-align: center;
      font-size: 12px;
      line-height: 14px;
      border-radius: 9px;
      margin-top: 3px;
    }
    > div:nth-of-type(2) {
      flex: 3;
      margin-left: 8px;
      font-size: 14px;
      width: 90%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    > div:nth-of-type(3) {
      margin-left: 8px;
      font-size: 0.8rem;
      color: #666;
    }
    .isCancel {
      display: block;
    }
  }
  .cancel-collect {
    display: none;
  }
  .liest-item:hover {
    background-color: #ececec;
    .cancel-collect {
      display: block;
      cursor: pointer;
      font-size: 14px;
      width: 74px;
      text-align: center;
      background-color: white;
      border-radius: 6px;
    }
    .time {
      display: none;
    }
    .name {
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .more-btn {
    position: absolute;
    left: 0;
    bottom: 0px;
    width: 100%;
    text-align: center;
    .btn {
      height: 42px;
      width: 100%;
    }
  }
}
.height-full {
  height: 100%;
}
.no-data {
  text-align: center;
  font-size: 0.8rem;
  opacity: 0.6;
  margin-top: 300px;
}
</style>
