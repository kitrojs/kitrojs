import React from "react"
import { defineBlock } from "../../index.js"

export interface DonationBlockProps {
  title?: string
  description?: string
  buttonLabel?: string
  paymentLinkUrl?: string
}

export const DonationBlock = defineBlock<DonationBlockProps>({
  meta: {
    name: "DonationBlock",
    label: "Donation",
    icon: "☕",
    category: "content",
    schema: {
      title: "string",
      description: "text",
      buttonLabel: "string",
      paymentLinkUrl: "string",
    },
  },
  render: (props) => {
    const {
      title = "Enjoying KitroJS?",
      description = "If KitroJS helps you build better websites, you can support the project by buying us a coffee. Your donation helps fund servers and new features.",
      buttonLabel = "Buy us a coffee ☕",
      paymentLinkUrl = "https://buy.stripe.com/fZufZg9puePz7LsfcL7AI00",
    } = props

    const isDisabled = !paymentLinkUrl || paymentLinkUrl.trim() === ""

    const handleClick = () => {
      if (!paymentLinkUrl || isDisabled) return
      window.open(paymentLinkUrl, "_blank", "noopener,noreferrer")
    }

    return (
      <div
        style={{
          background: isDisabled
            ? "rgba(15, 23, 42, 0.5)"
            : "rgba(15, 23, 42, 0.96)",
          border: isDisabled
            ? "1px solid rgba(30, 64, 175, 0.2)"
            : "1px solid rgba(30, 64, 175, 0.4)",
          boxShadow: isDisabled
            ? "none"
            : "0 18px 50px rgba(15, 23, 42, 0.9)",
          borderRadius: "16px",
          padding: "32px",
          color: isDisabled ? "#6b7280" : "#e5e7eb",
          textAlign: "center",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        {title && (
          <h2
            style={{
              marginTop: 0,
              marginBottom: "16px",
              fontSize: "24px",
              fontWeight: 600,
            }}
          >
            {title}
          </h2>
        )}
        {description && (
          <p
            style={{
              marginBottom: "24px",
              lineHeight: "1.6",
              opacity: isDisabled ? 0.6 : 0.9,
            }}
          >
            {description}
          </p>
        )}
        {isDisabled ? (
          <div
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              background: "rgba(107, 114, 128, 0.2)",
              color: "#6b7280",
              cursor: "not-allowed",
              display: "inline-block",
            }}
          >
            Donation link not configured yet
          </div>
        ) : (
          <button
            onClick={handleClick}
            style={{
              background: "linear-gradient(120deg, #a855f7, #ec4899, #22c55e)",
              color: "#020617",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: 500,
              cursor: "pointer",
              display: "inline-block",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(168, 85, 247, 0.4)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "none"
            }}
          >
            {buttonLabel}
          </button>
        )}
      </div>
    )
  },
})

