import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield, FileText, Heart } from 'lucide-react';

export default function LegalPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Legal & Privacy
        </h1>
        <p className="text-muted-foreground">
          Important information about your privacy and data usage
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Medical Disclaimer */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Medical Disclaimer
            </CardTitle>
            <CardDescription>
              Important information about the use of this application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-orange-800 dark:text-orange-200 font-medium mb-2">
                ⚠️ Important Notice
              </p>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                This application is for educational and research purposes only. It is not intended to diagnose, treat, cure, or prevent any disease or medical condition.
              </p>
            </div>
            
            <div className="space-y-3 text-sm">
              <p>
                The neurological assessments provided in this application are designed for educational and research purposes. They should not be used as a substitute for professional medical advice, diagnosis, or treatment.
              </p>
              <p>
                Always consult with qualified healthcare professionals for medical concerns, diagnosis, and treatment recommendations.
              </p>
              <p>
                The accuracy of assessments may vary and should not be relied upon for clinical decision-making.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Policy */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Privacy Policy
            </CardTitle>
            <CardDescription>
              How we handle your data and protect your privacy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <h4 className="font-semibold">Data Collection</h4>
              <p>
                This application may collect assessment data locally on your device. No personal health information is transmitted to external servers without your explicit consent.
              </p>
              
              <h4 className="font-semibold">Data Storage</h4>
              <p>
                Assessment results are stored locally on your device using secure storage methods. You have full control over your data and can delete it at any time.
              </p>
              
              <h4 className="font-semibold">Data Sharing</h4>
              <p>
                We do not share your personal data with third parties. Any data sharing for research purposes would require your explicit consent and would be anonymized.
              </p>
              
              <h4 className="font-semibold">Data Security</h4>
              <p>
                We implement appropriate security measures to protect your data. However, no method of transmission over the internet is 100% secure.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Terms of Service */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-500" />
              Terms of Service
            </CardTitle>
            <CardDescription>
              Terms and conditions for using this application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <h4 className="font-semibold">Acceptance of Terms</h4>
              <p>
                By using this application, you agree to these terms of service and acknowledge the medical disclaimer.
              </p>
              
              <h4 className="font-semibold">Use License</h4>
              <p>
                This application is provided for educational and research purposes. You may use it for personal, non-commercial purposes only.
              </p>
              
              <h4 className="font-semibold">Limitation of Liability</h4>
              <p>
                The developers of this application are not liable for any damages arising from the use of this software or reliance on its results.
              </p>
              
              <h4 className="font-semibold">Modifications</h4>
              <p>
                We reserve the right to modify these terms at any time. Continued use of the application constitutes acceptance of any changes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Contact & Support
            </CardTitle>
            <CardDescription>
              Get in touch with us for questions or support
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold">Questions?</h4>
                <p>
                  If you have any questions about this application, our privacy policy, or terms of service, please contact us.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Technical Support</h4>
                <p>
                  For technical issues or feature requests, please reach out through our support channels.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Medical Questions</h4>
                <p>
                  For medical questions or concerns, please consult with qualified healthcare professionals.
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Remember:</strong> This application is a tool for education and research. Always consult healthcare professionals for medical advice.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
