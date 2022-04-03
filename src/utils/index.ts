import { h } from 'vue'
import type { Component } from 'vue'
import { NIcon } from 'naive-ui'
import type { DialogOptions, NotificationOptions } from 'naive-ui'

export function renderIcon(icon: Component, attrs: object = {}) {
  return () => h(NIcon, attrs, { default: () => h(icon) })
}

export const dialogOptions = (options: DialogOptions) => ({
  title: 'Confirm',
  content: 'Are you sure?',
  positiveText: 'Sure',
  negativeText: 'Not Sure',
  ...options
})

export const notificationOptions = (options: NotificationOptions) => ({
  title: 'Notification',
  duration: 10000,
  closable: true,
  ...options
})
