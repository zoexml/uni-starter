<route lang="json5" type="page">
{
  layout: 'default',
  name: 'example-form',
  meta: {
    public: true,
  },
  style: {
    navigationBarTitleText: '表单示例',
  },
}
</route>

<script lang="ts" setup>
import dayjs from 'dayjs'
import type { ValidationError, ValidationSchema } from '@/utils/validate'
import { useTrackPageView } from '@/composables/useTracker'
import { validateForm } from '@/utils/validate'

useShare({ title: '表单示例' })
useTrackPageView()

interface ExperienceItem {
  company: string
  role: string
  period: string
}

/** 多条经历，演示「动态增删项 + 数组字段校验」 */
const form = reactive({
  nickname: '',
  phone: '',
  email: '',
  experience: [] as ExperienceItem[],
  remark: '',
})

const errors = ref<ValidationError[]>([])
const submitting = shallowRef(false)

/** 日期选择器给的是时间戳，校验与提交统一用 YYYY-MM-DD 字符串 */
const birthTimestamp = ref(0)
const birthDate = computed(() => birthTimestamp.value ? dayjs(birthTimestamp.value).format('YYYY-MM-DD') : '')

/** 字段错误信息索引，模板里直接按字段名取 */
const errorMap = computed(() => {
  const map: Record<string, string> = {}
  errors.value.forEach((item) => {
    if (!map[item.field]) map[item.field] = item.message
  })
  return map
})

const experienceErrors = computed(() => {
  const map: Record<number, string> = {}
  errors.value.forEach((item) => {
    const [, index] = item.field.split('.')
    const key = Number(index)
    if (!Number.isNaN(key) && !map[key]) map[key] = item.message
  })
  return map
})

/** 基础字段的校验规则，随表单一起声明 */
const baseSchema = computed<ValidationSchema>(() => ({
  nickname: [{ required: true, message: '请填写昵称' }, { minlength: 2, message: '昵称至少 2 个字符' }],
  phone: [{ required: true, message: '请填写手机号' }, { mobile: true, message: '手机号格式不正确' }],
  email: [{ email: true, message: '邮箱格式不正确' }],
  birthDate: [{ required: true, message: '请选择出生日期' }],
}))

const addExperience = () => {
  form.experience.push({ company: '', role: '', period: '' })
}

const handleValidate = () => {
  const schema: ValidationSchema = { ...baseSchema.value }

  // 数组字段用 `experience.0.company` 形式逐项校验
  form.experience.forEach((item, index) => {
    schema[`experience.${index}.company`] = [{ required: true, message: '请填写公司名称' }]
    schema[`experience.${index}.period`] = [{ required: true, message: '请填写在职时间' }]
  })

  errors.value = validateForm(schema, { ...form, birthDate: birthDate.value, experience: form.experience })
  return errors.value.length === 0
}

const removeExperience = (index: number) => {
  form.experience.splice(index, 1)
  // 删除后重新校验，避免错误索引错位
  if (errors.value.length) handleValidate()
}

const handleSubmit = async () => {
  if (!handleValidate()) {
    uni.showToast({ title: '请先修正表单错误', icon: 'none' })
    return
  }

  submitting.value = true
  try {
    // 真实项目在这里调接口提交
    await new Promise(resolve => setTimeout(resolve, 600))
    uni.showToast({ title: '提交成功', icon: 'success' })
  } finally {
    submitting.value = false
  }
}

/** 预填一组数据，方便直接看校验效果 */
const handleFillDemo = () => {
  form.nickname = '张小明'
  form.phone = '13800138000'
  form.email = 'demo@example.com'
  birthTimestamp.value = dayjs('1995-06-18').valueOf()
  form.experience = [
    { company: '某某科技', role: '前端工程师', period: '2022.03 - 至今' },
  ]
  errors.value = []
}
</script>

<template>
  <z-paging :show-scrollbar="false">
    <template #top>
      <Navbar title="复杂表单" />
    </template>

    <view class="form-page">
      <view class="form-card">
        <view class="form-card__title">
          validateForm 声明式校验
        </view>
        <view class="form-card__desc">
          基础字段用 schema 校验，动态数组用 experience.N.field 逐项校验；
          删除项后自动重新校验，避免错误索引错位。
        </view>
      </view>

      <view class="form-section">
        <wd-input
          v-model="form.nickname"
          label="昵称"
          placeholder="请输入昵称"
          :error="Boolean(errorMap.nickname)"
          clearable
        />
        <text v-if="errorMap.nickname" class="form-error">
          {{ errorMap.nickname }}
        </text>

        <wd-input
          v-model="form.phone"
          label="手机号"
          type="number"
          :maxlength="11"
          placeholder="请输入手机号"
          :error="Boolean(errorMap.phone)"
          clearable
        />
        <text v-if="errorMap.phone" class="form-error">
          {{ errorMap.phone }}
        </text>

        <wd-input
          v-model="form.email"
          label="邮箱"
          placeholder="选填"
          :error="Boolean(errorMap.email)"
          clearable
        />
        <text v-if="errorMap.email" class="form-error">
          {{ errorMap.email }}
        </text>

        <wd-datetime-picker
          v-model="birthTimestamp"
          type="date"
          title="选择出生日期"
          :error="Boolean(errorMap.birthDate)"
        />
        <text v-if="errorMap.birthDate" class="form-error">
          {{ errorMap.birthDate }}
        </text>
      </view>

      <view class="form-section">
        <view class="form-section__head">
          <text class="form-section__title">
            工作经历
          </text>
          <wd-button size="small" plain @click="addExperience">
            新增一项
          </wd-button>
        </view>

        <view v-for="(item, index) in form.experience" :key="index" class="form-item">
          <view class="form-item__head">
            <text class="form-item__index">
              第 {{ index + 1 }} 项
            </text>
            <text class="form-item__remove" @click="removeExperience(index)">
              删除
            </text>
          </view>

          <wd-input
            v-model="item.company"
            placeholder="公司名称"
            :error="Boolean(experienceErrors[index])"
          />
          <text v-if="experienceErrors[index]" class="form-error">
            {{ experienceErrors[index] }}
          </text>

          <wd-input
            v-model="item.role"
            placeholder="职位"
          />

          <wd-input
            v-model="item.period"
            placeholder="在职时间，如 2022.03 - 至今"
          />
        </view>

        <view v-if="!form.experience.length" class="form-empty">
          暂无经历，点「新增一项」添加
        </view>
      </view>

      <view class="form-section">
        <wd-textarea
          v-model="form.remark"
          label="备注"
          placeholder="选填"
          :maxlength="200"

          clearable show-word-limit
        />
      </view>

      <view class="form-actions">
        <wd-button block :loading="submitting" @click="handleSubmit">
          提交
        </wd-button>
        <wd-button plain block @click="handleFillDemo">
          填充示例数据
        </wd-button>
      </view>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
.form-page {
  min-height: 100%;
  padding: 32rpx;
  background: var(--app-color-surface-muted);
}

.form-card {
  padding: 32rpx;
  margin-bottom: 24rpx;
  background: var(--app-color-surface);
  border: 1rpx solid var(--app-color-border);
  border-radius: 16rpx;

  &__title {
    font-size: 32rpx;
    font-weight: 600;
    line-height: 1.35;
    color: var(--app-color-text);
  }

  &__desc {
    margin-top: 12rpx;
    font-size: 24rpx;
    line-height: 1.6;
    color: var(--app-color-text-secondary);
  }
}

.form-section {
  padding: 8rpx 32rpx 24rpx;
  margin-bottom: 24rpx;
  background: var(--app-color-surface);
  border: 1rpx solid var(--app-color-border);
  border-radius: 16rpx;

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx 0 8rpx;
  }

  &__title {
    font-size: 30rpx;
    font-weight: 600;
    line-height: 1.35;
    color: var(--app-color-text);
  }
}

.form-item {
  padding: 24rpx;
  margin-top: 20rpx;
  background: var(--app-color-surface-muted);
  border-radius: 12rpx;

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16rpx;
  }

  &__index {
    font-size: 24rpx;
    font-weight: 600;
    line-height: 1.4;
    color: var(--app-color-text-regular);
  }

  &__remove {
    padding: 8rpx;
    font-size: 24rpx;
    line-height: 1.4;
    color: var(--app-color-danger);
  }

  :deep(.wd-input) {
    padding: 16rpx 0;
  }

  :deep(.wd-input + .wd-input) {
    border-top: 1rpx solid var(--app-color-border);
  }
}

.form-error {
  display: block;
  padding: 0 0 12rpx;
  font-size: 22rpx;
  line-height: 1.5;
  color: var(--app-color-danger);
}

.form-empty {
  padding: 40rpx 0 24rpx;
  font-size: 24rpx;
  line-height: 1.5;
  color: var(--app-color-text-tertiary);
  text-align: center;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding-bottom: 40rpx;
}
</style>
