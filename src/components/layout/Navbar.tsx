import { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { navItems } from '@/data/navigation'

const butterSpring = {
  type: 'spring' as const,
  stiffness: 280,
  damping: 36,
  mass: 0.9,
}

const butterEase = [0.22, 1, 0.36, 1] as const

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const menuPanelRef = useRef<HTMLDivElement>(null)
  const lockedScrollY = useRef(0)

  useEffect(() => {
    if (!open) return

    lockedScrollY.current = window.scrollY

    const insideMenu = (target: EventTarget | null) =>
      menuPanelRef.current?.contains(target as Node) ?? false

    const onWheel = (e: WheelEvent) => {
      if (!insideMenu(e.target)) e.preventDefault()
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!insideMenu(e.target)) e.preventDefault()
    }

    const onScroll = () => {
      const y = lockedScrollY.current
      if (Math.abs(window.scrollY - y) > 1) {
        window.scrollTo({ top: y, left: 0, behavior: 'auto' })
      }
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('wheel', onWheel, { passive: false })
    document.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('scroll', onScroll, { capture: true })
    document.addEventListener('keydown', onKey)

    return () => {
      document.removeEventListener('wheel', onWheel)
      document.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('scroll', onScroll, { capture: true })
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-[var(--ink-faint)] bg-[var(--paper)]">
        <div className="relative mx-auto flex w-full max-w-[90rem] items-center justify-between px-5 py-3.5 pt-6 md:px-8 lg:px-10">
          <a
            href="/"
            className="group focus-ink flex items-center gap-2.5"
          >
            <img
              src="/icon.svg"
              alt=""
              className="h-7 w-7"
              aria-hidden="true"
            />
          </a>

          {/* Desktop nav */}
          <div className="relative hidden items-center gap-8 md:flex">
            <span
              className="pointer-events-none absolute -top-5 right-0 font-hand text-[1.05rem] leading-none text-[var(--ink)]"
              aria-hidden="true"
            >
              building things
              <svg
                className="ml-0.5 inline-block h-3 w-5 align-middle text-[var(--ink)]"
                viewBox="0 0 20 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2,2 C7,6 12,9 18,10"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  d="M13,7 C15.5,8.5 17,9.5 18.2,10.2 C16,9.5 14,10 12,11"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <ul className="flex items-center gap-7">
              {navItems.map((item, i) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="focus-ink group/nav relative font-mono text-[11px] tracking-[0.18em] text-[var(--ink-muted)] uppercase transition-colors hover:text-[var(--ink)]"
                  >
                    {item.label}
                    {i === 0 && (
                      <svg
                        className="pointer-events-none absolute -bottom-1 left-0 h-2 w-full overflow-visible text-[var(--ink)]"
                        viewBox="0 0 64 8"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M1,5.2 C12,3.6 28,6.2 42,4.4 C52,3.2 58,5.5 63,4.8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile menu trigger */}
          <div className="relative h-11 w-28 shrink-0 md:hidden">
            <motion.div
              ref={menuPanelRef}
              className="absolute top-0 right-0 z-50 overflow-hidden border border-[var(--ink)] bg-[var(--paper)] text-[var(--ink-deep)]"
              initial={false}
              animate={{
                width: open ? 200 : 112,
                height: open ? 280 : 44,
              }}
              transition={butterSpring}
              style={{ transformOrigin: '100% 0%' }}
            >
              <button
                type="button"
                aria-expanded={open}
                aria-label={open ? 'Close menu' : 'Open menu'}
                onClick={() => setOpen((v) => !v)}
                className="focus-ink flex h-11 w-full items-center justify-end gap-2 px-3.5"
              >
                <span className="font-mono text-[11px] tracking-[0.2em] uppercase">
                  Menu
                </span>
                {open ? <X size={16} /> : <Menu size={16} />}
              </button>

              <AnimatePresence>
                {open && (
                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      opacity: { duration: 0.3, ease: butterEase },
                    }}
                    className="space-y-3 px-5 pt-2 pb-5"
                  >
                    {navItems.map((item, i) => (
                      <motion.li
                        key={item.label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{
                          delay: 0.04 + i * 0.03,
                          duration: 0.35,
                          ease: butterEase,
                        }}
                      >
                        <a
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="focus-ink block font-mono text-sm tracking-wide text-[var(--ink)]"
                        >
                          {item.label}
                        </a>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: butterEase }}
            className="fixed inset-0 z-40 bg-[color-mix(in_srgb,var(--ink-deep)_20%,transparent)] md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  )
}
