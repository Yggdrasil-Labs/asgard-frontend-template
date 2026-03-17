import type {
  FormFieldMeta,
  FormFieldSchema,
  FormFieldUi,
  ProFormContext,
} from '@/types/pro-form'

export type DetailFieldMeta = FormFieldMeta & {
  /** 仅详情使用的空值占位文案 */
  emptyText?: string
}

export type DetailFieldUi = FormFieldUi & {
  /** 仅详情使用的一键复制开关 */
  copyable?: boolean
}

export interface DetailFieldSchema extends FormFieldSchema {
  meta: DetailFieldMeta
  ui: DetailFieldUi
}

export type ProDetailContext = ProFormContext
