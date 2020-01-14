<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" :placeholder="$t('table.equipment.name')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.isShwo" :placeholder="$t('table.equipment.isShwo')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in isShow" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.modelType" :placeholder="$t('table.equipment.modelName')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in modelType" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.billId" :placeholder="$t('table.equipment.billName')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in billId" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      row-key="id"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.equipment.name')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.equipment.isShwo')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.isShwo }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.equipment.modelName')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.modelName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.equipment.billName')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.billName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.equipment.fliterName')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.fliterName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row.id)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row.id)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 50%;">
      <el-form-item :label="$t('table.equipment.name')" prop="name">
        <el-input v-model="temp.name" />
      </el-form-item>
      <el-form-item :label="$t('table.equipment.modelName')" prop="modelType">
        <el-select v-model="temp.modelType"  clearable class="filter-item" style="width: 130px">
          <el-option v-for="item in modelType" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('table.equipment.modelName')" prop="modelType">
        <el-select v-model="temp.modelType"  clearable class="filter-item" style="width: 130px">
          <el-option v-for="item in modelType" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
      </el-form-item>
    </el-form>
  </el-dialog>
  </div>
</template>

<script>
import { list } from '@/api/equipment'
import Pagination from '@/components/Pagination'

const isShow = [
  { key: '0', display_name: '隐藏' },
  { key: '1', display_name: '显示' }
]
const modelType = [
  { key: '0', display_name: 'RO机' },
  { key: '1', display_name: '超滤机' }
]
const billId = [
  { key: '1', display_name: '时长' },
  { key: '2', display_name: '流量' },
  { key: '3', display_name: '套餐' },
  { key: '4', display_name: '零售' }
]

export default {
  components: { Pagination },
  data() {
    return {
      listLoading: true,
      total: 0,
      list: null,
      listQuery: {
        page: 1,
        limit: 20,
        name: '',
        isShwo: '',
        modelType: '',
        billId: ''
      },
      isShow,
      modelType,
      billId,
      dialogFormVisible: false,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      temp: {
        name: '',
        modelType: ''
      },
      rules: {

      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      list(this.listQuery).then(response => {
        this.list = response.rows
        this.total = response.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {},
    handleUpdate() {},
    handleDelete() {},

    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    }

  }

}
</script>

<style>
</style>
