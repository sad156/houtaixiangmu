<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.uname" :placeholder="$t('table.menu.menuName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilters" />
      <!-- <el-select v-model="listQuery.visible" :placeholder="$t('table.menu.visible')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in visible" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select> -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">
        {{ $t('table.recharge.rechargeInfo') }}
      </el-button> -->

    </div>

    <el-table
      v-loading="listLoading"
      row-key="id"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :tree-props="{children: 'children'}"
    >
      <!-- 序号 -->
      <el-table-column :label="$t('table.maintain.id')" prop="id" sortable="custom" align="center" width="100" :class-name="getSortClass('id')">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <!-- 用户名称 -->
      <el-table-column :label="$t('table.maintain.userName')" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>

      <!-- 联系方式 -->
      <el-table-column :label="$t('table.maintain.phone')" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <!-- 省 -->
      <el-table-column :label="$t('table.maintain.province')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
        </template>
      </el-table-column>

      <!-- 城市 -->
      <el-table-column :label="$t('table.maintain.city')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>

      <!-- 县/区 -->
      <el-table-column :label="$t('table.maintain.county')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.county }}</span>
        </template>
      </el-table-column>

      <!-- 详细地址 -->
      <el-table-column :label="$t('table.maintain.address')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>

      <!-- 预约时间 -->
      <el-table-column :label="$t('table.maintain.reportTime')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.reportTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <!-- 设备ID -->
      <el-table-column :label="$t('table.maintain.unitId')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.unitId }}</span>
        </template>
      </el-table-column>

      <!-- 物联网号 -->
      <el-table-column :label="$t('table.maintain.iccid')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.iccid }}</span>
        </template>
      </el-table-column>

      <!-- 设备型号 -->
      <el-table-column :label="$t('table.maintain.equipmentName')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.equipmentName }}</span>
        </template>
      </el-table-column>

      <!-- 报修内容 -->
      <el-table-column :label="$t('table.maintain.coment')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.coment }}</span>
        </template>
      </el-table-column>

      <!-- 设备状态 -->
      <el-table-column :label="$t('table.maintain.unitStatus')" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.unitStatus }}</span>
        </template>
      </el-table-column>

      <!-- 状态-->
      <el-table-column :label="$t('table.maintain.status')" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row}">

          <!-- <el-button class="filter-item" style="margin-left: 10px;" type="small" @click="handleCance(row.id)">

        {{ $t('table.recharge.agree') }}
      </el-button> -->
          <el-button class="filter-item" style="margin-left: 10px;" type="small" @click="handleReco(row.id)">

            {{ $t('table.details') }}
          </el-button>

          <!-- <el-button type="primary" size="mini" @click="handleUpdate(row.id)">
            {{ $t('table.recharge.agree') }}
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row.id)">
            {{ $t('table.recharge.reject') }}
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 100%;">
        <div>
          <el-form-item :label="$t('table.maintain.id')">
            <el-input v-model="temp.id" />
          </el-form-item>

          <el-form-item :label="$t('table.maintain.userName')">
            <el-input v-model="listQuery.userName" />
          </el-form-item>
          <el-form-item :label="$t('table.maintain.city')">
            <el-input v-model="listQuery.city" />
          </el-form-item>
          <el-form-item :label="$t('table.maintain.county')">
            <el-input v-model="listQuery.county" />
          </el-form-item>

          <el-form-item :label="$t('table.maintain.address')">
            <el-input v-model="listQuery.address" />
          </el-form-item>
          <!-- <el-form-item :label="$t('table.maintain.id ')">
              <el-input v-model="temp.id " />
            </el-form-item> -->

          <el-form-item :label="$t('table.maintain.feedback')">
            <el-input v-model="temp.feedInfo " />
          </el-form-item>

          <el-form-item v-if="dialogStatus != 'update'" :label="$t('table.remark')">
            <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// import { list, getAllMenuName, add, queryMenuByid, editMenu, delMenu } from '@/api/menu'
import { editFeedInfo, queryMaintainByid, list } from '@/api/maintain'
import Pagination from '@/components/Pagination'
const sex = [
  { key: '0', display_name: '女' },
  { key: '1', display_name: '男' }
]

const visible = [
  { key: '0', display_name: '启用' },
  { key: '1', display_name: '隐藏' }
]

export default {
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        unitId: '',
        menuName: '',
        visible: '',
        name: '',
        address: '',
        phone: '',
        page: 1,
        id: ''

      },
      visible,
      sex,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogFormVisible: false,
      rules: {
        name: [{ required: true, message: 'dealername is required', trigger: 'change' },
          { min: 3, max: 5, message: 'The length is between 3 and 5 characters', trigger: 'blur' }],
        province: [{ required: true, message: 'code is required', trigger: 'change' }],
        city: [{ required: true, message: 'num is required', trigger: 'change' }],
        sex: [{ required: true, message: 'sex is required', trigger: 'change' }],
        county: [{ required: true, message: 'area is required', trigger: 'change' }],
        phone: [{ required: true, message: 'phone is required', trigger: 'change' }],
        waiterPhone: [{ required: true, message: 'service is required', trigger: 'change' }]
      },
      temp: {
        id: '',
        feedInfo: ''
      },
      dialogStatus: '',
      hiden: '',
      treeData: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      list(this.listQuery).then(res => {
        if (res.code === 200) {
          console.log(res)
          this.list = res.rows
          this.total = res.total
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }
      })
    },
    // 获取菜单tree
    // getAllMenuName() {
    //   getAllMenuName().then(res => {
    //     if (res.code === 200) {
    //       this.treeData = res.data
    //     }
    //   })
    // },
    resetTemp() {
      this.temp = {
        id: '',
        feedInfo: ''
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 搜索
    handleFilters() {
    //   this.listQuery.page = 1
    //   this.getList()

    },
    // 审批通过
    handleCance(id) {
      agree({ 'id': id }).then(res => {
        if (res.code === 200) {
          this.getList()
        }
      })
    },
    // 反馈维修信息
    handleReco(id) {
      queryMaintainByid({ 'id': id }).then(res => {
      // console.log(this.listQuery)
        if (res.code === 200) {
          console.log(res)
          this.listQuery = res.data
          console.log(this.listQuery)
          this.resetTemp()
        }
      })
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })

    //   editFeedInfo({ 'id': id }).then(res => {
    //     if (res.code === 200) {
    //      this.getList()
    //     }
    //   })
    },
    // 添加
    handleCreate() {
      // this.getList()
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 添加确认按钮
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        console.log('------------------------------------------------------------------')
        if (valid) {
          editFeedInfo(this.temp).then(res => {
            if (res.code === 200) {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
    // 查看详情
    handleUpdate(id) {
      agree({ 'id': id }).then(res => {
        if (res.code === 200) {
          this.getList()
          this.temp = Object.assign({}, res.data) // copy obj
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          editStation(tempData).then(res => {
            if (res.code === 200) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: res.msg,
                type: 'success',
                duration: 2000
              })
              this.getList()
            }
          })
        }
      })
    },
    handleDelete(id) {
      reject({ 'id': id }).then(res => {
        if (res.code === 200) {
          this.$notify({
            title: '成功',
            message: res.msg,
            type: 'success',
            duration: 2000
          })
          this.getList()
        }
      })
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    },
    hindleChanged(val) {
      console.log(val[0].id)
      this.temp.stationId = val[0].id
      console.log(this.temp.stationId)
    }
  }
}
</script>

<style>
.el-form-item__label {
  width:110px;
}
/* .el-form-item__label */
</style>
