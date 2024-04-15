import Link from 'next/link'
import { useState, useEffect, ReactNode } from 'react'

interface ModalProps {
  trigger: ReactNode // モーダルを開くトリガーとなるReact要素
  modalContent?: string // モーダルの内容
  modalLinks: Array<{ text: string; url?: string; onClick?: () => void }> // モーダル内のリンク
}

const LinksDropDown: React.FC<ModalProps> = ({
  trigger,
  modalContent,
  modalLinks,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = (e: MouseEvent) => {
    if (
      e.target instanceof Element &&
      (e.target.closest('.modal') || e.target.closest('.trigger'))
    ) {
      return
    }
    setIsModalOpen(false)
  }

  useEffect(() => {
    window.addEventListener('click', closeModal)
    return () => {
      window.removeEventListener('click', closeModal)
    }
  }, [])

  return (
    <div>
      <div className="trigger" onClick={openModal}>
        {trigger}
      </div>
      {isModalOpen && (
        <div
          className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none modal"
          role="menu"
          aria-orientation="vertical"
          tabIndex={-1}
        >
          <p>{modalContent}</p>
          {modalLinks.map((link, index) => (
            <Link
              className="block px-4 py-2 text-sm text-gray-700"
              role="menuitem"
              key={index}
              href={link.url ? link.url : '#'}
              onClick={link.onClick}
            >
              {link.text}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default LinksDropDown
