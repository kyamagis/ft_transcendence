interface propsType {
  submitHandler: () => void
}

export function SubmitButton({ submitHandler }: propsType) {
  return (
    <div className="flex justify-center">
      <button
        className="mt-2 px-4 py-2 bg-gray-800 bg-opacity-70 text-white rounded"
        onClick={() => {
          submitHandler()
        }}
      >
        Submit
      </button>
    </div>
  )
}
