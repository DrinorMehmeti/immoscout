import React, { useState } from 'react';
import { Copy, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface PaymentInstructionsProps {
  amount: number;
  period: 'monthly' | 'annual';
}

const PaymentInstructions: React.FC<PaymentInstructionsProps> = ({ amount, period }) => {
  const { authState } = useAuth();
  const { darkMode } = useTheme();
  const [idCopied, setIdCopied] = useState(false);
  const [ibanCopied, setIbanCopied] = useState(false);
  
  const personalId = authState.user?.profile?.personal_id || '';
  const paymentReference = `PREMIUM-${personalId}`;
  const bankIban = "XK051100001156010110";

  const copyToClipboard = (text: string, type: 'id' | 'iban') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setIdCopied(true);
      setTimeout(() => setIdCopied(false), 2000);
    } else {
      setIbanCopied(true);
      setTimeout(() => setIbanCopied(false), 2000);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 my-8`}>
      <div className="flex items-center mb-4">
        <AlertCircle className="h-6 w-6 text-blue-600 mr-2" />
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Udhëzime për pagesë
        </h3>
      </div>

      <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg mb-6`}>
        <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
          Për të aktivizuar abonimin premium, ju lutem bëni një transfertë bankare me detajet e mëposhtme:
        </p>
        
        <div className="space-y-4 mt-4">
          <div>
            <div className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Shuma për pagesë:</div>
            <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {amount.toFixed(2)} € ({period === 'monthly' ? 'mujore' : 'vjetore'})
            </div>
          </div>
          
          <div>
            <div className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>IBAN:</div>
            <div className="flex items-center">
              <code className={`px-3 py-2 rounded font-mono text-sm ${darkMode ? 'bg-gray-800 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                {bankIban}
              </code>
              <button
                onClick={() => copyToClipboard(bankIban, 'iban')}
                className={`ml-2 p-1.5 rounded-full ${
                  darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {ibanCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div>
            <div className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Përshkrimi/Referenca:</div>
            <div className="flex items-center">
              <code className={`px-3 py-2 rounded font-mono text-sm ${darkMode ? 'bg-gray-800 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                {paymentReference}
              </code>
              <button
                onClick={() => copyToClipboard(paymentReference, 'id')}
                className={`ml-2 p-1.5 rounded-full ${
                  darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {idCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm space-y-2`}>
        <p>
          <strong>E rëndësishme:</strong> Ju lutem përdorni saktësisht ID-në tuaj personale në përshkrimin e pagesës për të identifikuar pagesën tuaj.
        </p>
        <p>
          Pasi të kryhet pagesa, llogaria juaj do të përditësohet në Premium brenda 1-2 ditëve të punës.
        </p>
        <p className="flex items-start">
          <ExternalLink className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" /> 
          <span>Për ndihmë shtesë, kontaktoni mbështetjen teknike në <a href="mailto:support@realestate-kosovo.com" className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>support@realestate-kosovo.com</a></span>
        </p>
      </div>
    </div>
  );
};

export default PaymentInstructions;