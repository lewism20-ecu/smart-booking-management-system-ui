import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const TERMS_OF_SERVICE = [
  {
    heading: "1. Acceptance of Terms",
    body: `By accessing or using the Smart Booking Management System ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.`,
  },
  {
    heading: "2. Use of the Service",
    body: `The Service is provided for legitimate business booking and management purposes only. You agree to use the Service in compliance with all applicable laws and regulations. You must not misuse or attempt to disrupt the Service.`,
  },
  {
    heading: "3. Account Registration",
    body: `You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorised use of your account.`,
  },
  {
    heading: "4. Prohibited Activities",
    body: `You agree not to: (a) attempt to gain unauthorised access to any part of the Service; (b) transmit any harmful, offensive, or disruptive content; (c) use the Service to violate the rights of any third party; or (d) reverse-engineer or attempt to extract source code from the Service.`,
  },
  {
    heading: "5. Intellectual Property",
    body: `All content, trademarks, and technology within the Service remain the exclusive property of Smart Booking Management System and its licensors. No rights are granted to you other than the limited right to use the Service as described herein.`,
  },
  {
    heading: "6. Disclaimer of Warranties",
    body: `The Service is provided "as is" without warranties of any kind, whether express or implied. We do not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components.`,
  },
  {
    heading: "7. Limitation of Liability",
    body: `To the fullest extent permitted by law, Smart Booking Management System shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.`,
  },
  {
    heading: "8. Changes to These Terms",
    body: `We reserve the right to update these Terms of Service at any time. Continued use of the Service after changes are posted constitutes your acceptance of the revised terms.`,
  },
  {
    heading: "9. Contact",
    body: `For questions about these Terms of Service, please contact us through the support channels available within the Service.`,
  },
];

const PRIVACY_POLICY = [
  {
    heading: "1. Information We Collect",
    body: `We collect information you provide directly (such as your name and email address when registering), information generated through your use of the Service (such as booking records and activity logs), and technical data (such as IP address and browser type).`,
  },
  {
    heading: "2. How We Use Your Information",
    body: `We use your information to: provide and improve the Service; authenticate your identity; send service-related communications; and comply with legal obligations. We do not sell your personal data to third parties.`,
  },
  {
    heading: "3. Data Sharing",
    body: `We may share your information with trusted service providers who assist in operating the Service, provided they agree to keep your information confidential. We may also disclose information when required by law or to protect the rights and safety of users.`,
  },
  {
    heading: "4. Data Retention",
    body: `We retain your personal data for as long as your account is active or as needed to provide the Service. You may request deletion of your account and associated data at any time by contacting support.`,
  },
  {
    heading: "5. Data Security",
    body: `We implement industry-standard technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.`,
  },
  {
    heading: "6. Cookies",
    body: `The Service may use session cookies and similar technologies to maintain your authenticated session. These are strictly necessary for the Service to function and do not track you across third-party websites.`,
  },
  {
    heading: "7. Your Rights",
    body: `Depending on your jurisdiction, you may have the right to access, correct, or delete your personal data, or to restrict or object to its processing. To exercise these rights, please contact us through the support channels within the Service.`,
  },
  {
    heading: "8. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice within the Service. Continued use after the update constitutes acceptance of the revised policy.`,
  },
  {
    heading: "9. Contact",
    body: `For privacy-related enquiries or to exercise your data rights, please contact us through the support channels available within the Service.`,
  },
];

const LEGAL_CONTENT = {
  terms: {
    title: "Terms of Service",
    lastUpdated: "April 2026",
    sections: TERMS_OF_SERVICE,
  },
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "April 2026",
    sections: PRIVACY_POLICY,
  },
};

export default function LegalModal({ open, onClose, type }) {
  const content = LEGAL_CONTENT[type];
  if (!content) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      maxWidth="md"
      fullWidth
      aria-labelledby="legal-modal-title"
    >
      <DialogTitle
        id="legal-modal-title"
        sx={{
          pr: 6,
          fontWeight: 700,
          fontSize: { xs: 18, sm: 22 },
        }}
      >
        {content.title}
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="close"
          sx={{ position: "absolute", top: 12, right: 12 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ px: { xs: 2.5, sm: 4 }, py: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Last updated: {content.lastUpdated}. This is placeholder content that
          will be updated before launch.
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {content.sections.map((section) => (
            <Box key={section.heading}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                {section.heading}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {section.body}
              </Typography>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
