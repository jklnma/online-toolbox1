"use client"

import { Component, ReactNode } from "react"

interface Props {
  children: ReactNode
  toolName?: string
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">工具运行出错</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {this.props.toolName || "该工具"}遇到了一个错误，请刷新页面重试
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
          >
            重试
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
