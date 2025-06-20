
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';

export const PrivacyNotice = () => {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Shield className="h-5 w-5" />
          Your Privacy is Protected
        </CardTitle>
        <CardDescription className="text-green-700">
          Complete end-to-end encryption ensures your data remains private
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800">Client-Side Encryption</h4>
              <p className="text-sm text-green-700">
                All your data is encrypted on your device before being sent to our servers.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <EyeOff className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800">Zero Knowledge</h4>
              <p className="text-sm text-green-700">
                Our administrators cannot read your personal information, even if they wanted to.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-white rounded border border-green-200">
          <h4 className="font-medium text-green-800 mb-2">How it works:</h4>
          <ol className="text-sm text-green-700 space-y-1">
            <li>1. Your password creates a unique encryption key</li>
            <li>2. Data is encrypted on your device before upload</li>
            <li>3. Only encrypted data is stored on our servers</li>
            <li>4. Data is decrypted only on your device when you access it</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};
