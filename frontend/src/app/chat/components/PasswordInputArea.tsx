interface propsType {
  onChangeCallFC: (value: string) => void
  helperText: string
}

export function PasswordInputArea({ onChangeCallFC, helperText }: propsType) {
  return (
    <div className="flex flex-col mt-3">
      <label htmlFor="password">Password</label>
      <input
        type="password"
        className="border rounded p-1 flex-1 min-w-0"
        id="password"
        name="password"
        onChange={(e) => {
          onChangeCallFC(e.target.value)
        }}
      />
      <span className="text-xs mt-1 text-gray-500">{helperText}</span>
    </div>
  )
}
