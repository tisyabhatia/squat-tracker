// import React, { useState } from 'react';
// import { useApp } from '../contexts/AppContext';
// import { BodyMetrics } from '../types';
// import { ArrowLeft, Plus, TrendingUp, TrendingDown, Minus, Calendar, Camera } from 'lucide-react';
// import { format } from 'date-fns';

// interface BodyMeasurementsProps {
//   onBack: () => void;
// }

// const BodyMeasurements: React.FC<BodyMeasurementsProps> = ({ onBack }) => {
//   const { userProfile, updateUserProfile } = useApp();
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [selectedMetric, setSelectedMetric] = useState<BodyMetrics | null>(null);

//   // Get body metrics from user profile (we'll store it there)
//   const bodyMetrics: BodyMetrics[] = (userProfile?.bodyMetrics as BodyMetrics[]) || [];

//   const [newMetric, setNewMetric] = useState<Partial<BodyMetrics>>({
//     date: new Date().toISOString(),
//     weight: undefined,
//     bodyFat: undefined,
//     measurements: {
//       chest: undefined,
//       waist: undefined,
//       hips: undefined,
//       leftBicep: undefined,
//       rightBicep: undefined,
//       leftThigh: undefined,
//       rightThigh: undefined,
//       leftCalf: undefined,
//       rightCalf: undefined,
//       shoulders: undefined,
//       neck: undefined,
//     },
//     notes: '',
//   });

//   const handleAddMetric = () => {
//     if (!userProfile) return;

//     const metric: BodyMetrics = {
//       id: Date.now().toString(),
//       date: newMetric.date || new Date().toISOString(),
//       weight: newMetric.weight,
//       bodyFat: newMetric.bodyFat,
//       measurements: newMetric.measurements,
//       notes: newMetric.notes,
//     };

//     const updatedMetrics = [...bodyMetrics, metric].sort(
//       (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//     );

//     updateUserProfile({
//       bodyMetrics: updatedMetrics as any,
//     });

//     // Reset form
//     setNewMetric({
//       date: new Date().toISOString(),
//       weight: undefined,
//       bodyFat: undefined,
//       measurements: {
//         chest: undefined,
//         waist: undefined,
//         hips: undefined,
//         leftBicep: undefined,
//         rightBicep: undefined,
//         leftThigh: undefined,
//         rightThigh: undefined,
//         leftCalf: undefined,
//         rightCalf: undefined,
//         shoulders: undefined,
//         neck: undefined,
//       },
//       notes: '',
//     });
//     setShowAddForm(false);
//   };

//   const getChange = (current?: number, previous?: number) => {
//     if (!current || !previous) return null;
//     const diff = current - previous;
//     return {
//       value: Math.abs(diff),
//       direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'same',
//     };
//   };

//   const getMeasurementChange = (field: keyof NonNullable<BodyMetrics['measurements']>) => {
//     if (bodyMetrics.length < 2) return null;
//     const current = bodyMetrics[0]?.measurements?.[field];
//     const previous = bodyMetrics[1]?.measurements?.[field];
//     return getChange(current, previous);
//   };

//   const latestMetric = bodyMetrics[0];
//   const unitSystem = userProfile?.preferences.unitSystem || 'imperial';
//   const weightUnit = unitSystem === 'imperial' ? 'lbs' : 'kg';
//   const measurementUnit = unitSystem === 'imperial' ? 'in' : 'cm';

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b sticky top-0 z-10">
//         <div className="max-w-4xl mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={onBack}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <ArrowLeft className="w-5 h-5" />
//               </button>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">Body Measurements</h1>
//                 <p className="text-sm text-gray-600">Track your physical progress</p>
//               </div>
//             </div>
//             <button
//               onClick={() => setShowAddForm(!showAddForm)}
//               className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               <Plus className="w-5 h-5" />
//               Add Entry
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
//         {/* Add Form */}
//         {showAddForm && (
//           <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
//             <h2 className="text-xl font-bold text-gray-900">New Measurement Entry</h2>

//             {/* Date */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Date
//               </label>
//               <input
//                 type="date"
//                 value={newMetric.date ? format(new Date(newMetric.date), 'yyyy-MM-dd') : ''}
//                 onChange={(e) => setNewMetric({ ...newMetric, date: new Date(e.target.value).toISOString() })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             {/* Weight & Body Fat */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Weight ({weightUnit})
//                 </label>
//                 <input
//                   type="number"
//                   step="0.1"
//                   value={newMetric.weight || ''}
//                   onChange={(e) => setNewMetric({ ...newMetric, weight: parseFloat(e.target.value) || undefined })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="0.0"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Body Fat (%)
//                 </label>
//                 <input
//                   type="number"
//                   step="0.1"
//                   value={newMetric.bodyFat || ''}
//                   onChange={(e) => setNewMetric({ ...newMetric, bodyFat: parseFloat(e.target.value) || undefined })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="0.0"
//                 />
//               </div>
//             </div>

//             {/* Measurements */}
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-3">Measurements ({measurementUnit})</h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1">Chest</label>
//                   <input
//                     type="number"
//                     step="0.1"
//                     value={newMetric.measurements?.chest || ''}
//                     onChange={(e) => setNewMetric({
//                       ...newMetric,
//                       measurements: { ...newMetric.measurements, chest: parseFloat(e.target.value) || undefined }
//                     })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="0.0"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1">Shoulders</label>
//                   <input
//                     type="number"
//                     step="0.1"
//                     value={newMetric.measurements?.shoulders || ''}
//                     onChange={(e) => setNewMetric({
//                       ...newMetric,
//                       measurements: { ...newMetric.measurements, shoulders: parseFloat(e.target.value) || undefined }
//                     })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="0.0"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1">Waist</label>
//                   <input
//                     type="number"
//                     step="0.1"
//                     value={newMetric.measurements?.waist || ''}
//                     onChange={(e) => setNewMetric({
//                       ...newMetric,
//                       measurements: { ...newMetric.measurements, waist: parseFloat(e.target.value) || undefined }
//                     })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="0.0"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1">Hips</label>
//                   <input
//                     type="number"
//                     step="0.1"
//                     value={newMetric.measurements?.hips || ''}
//                     onChange={(e) => setNewMetric({
//                       ...newMetric,
//                       measurements: { ...newMetric.measurements, hips: parseFloat(e.target.value) || undefined }
//                     })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="0.0"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1">Left Bicep</label>
//                   <input
//                     type="number"
//                     step="0.1"
//                     value={newMetric.measurements?.leftBicep || ''}
//                     onChange={(e) => setNewMetric({
//                       ...newMetric,
//                       measurements: { ...newMetric.measurements, leftBicep: parseFloat(e.target.value) || undefined }
//                     })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="0.0"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1">Right Bicep</label>
//                   <input
//                     type="number"
//                     step="0.1"
//                     value={newMetric.measurements?.rightBicep || ''}
//                     onChange={(e) => setNewMetric({
//                       ...newMetric,
//                       measurements: { ...newMetric.measurements, rightBicep: parseFloat(e.target.value) || undefined }
//                     })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="0.0"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1">Left Thigh</label>
//                   <input
//                     type="number"
//                     step="0.1"
//                     value={newMetric.measurements?.leftThigh || ''}
//                     onChange={(e) => setNewMetric({
//                       ...newMetric,
//                       measurements: { ...newMetric.measurements, leftThigh: parseFloat(e.target.value) || undefined }
//                     })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="0.0"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1">Right Thigh</label>
//                   <input
//                     type="number"
//                     step="0.1"
//                     value={newMetric.measurements?.rightThigh || ''}
//                     onChange={(e) => setNewMetric({
//                       ...newMetric,
//                       measurements: { ...newMetric.measurements, rightThigh: parseFloat(e.target.value) || undefined }
//                     })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="0.0"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1">Left Calf</label>
//                   <input
//                     type="number"
//                     step="0.1"
//                     value={newMetric.measurements?.leftCalf || ''}
//                     onChange={(e) => setNewMetric({
//                       ...newMetric,
//                       measurements: { ...newMetric.measurements, leftCalf: parseFloat(e.target.value) || undefined }
//                     })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="0.0"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1">Right Calf</label>
//                   <input
//                     type="number"
//                     step="0.1"
//                     value={newMetric.measurements?.rightCalf || ''}
//                     onChange={(e) => setNewMetric({
//                       ...newMetric,
//                       measurements: { ...newMetric.measurements, rightCalf: parseFloat(e.target.value) || undefined }
//                     })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="0.0"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1">Neck</label>
//                   <input
//                     type="number"
//                     step="0.1"
//                     value={newMetric.measurements?.neck || ''}
//                     onChange={(e) => setNewMetric({
//                       ...newMetric,
//                       measurements: { ...newMetric.measurements, neck: parseFloat(e.target.value) || undefined }
//                     })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="0.0"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Notes */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Notes
//               </label>
//               <textarea
//                 value={newMetric.notes || ''}
//                 onChange={(e) => setNewMetric({ ...newMetric, notes: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 rows={3}
//                 placeholder="Any notes about this measurement..."
//               />
//             </div>

//             {/* Buttons */}
//             <div className="flex gap-3">
//               <button
//                 onClick={handleAddMetric}
//                 className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//               >
//                 Save Entry
//               </button>
//               <button
//                 onClick={() => setShowAddForm(false)}
//                 className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Latest Metrics Summary */}
//         {latestMetric && (
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-bold text-gray-900">Latest Measurements</h2>
//               <div className="flex items-center gap-2 text-sm text-gray-600">
//                 <Calendar className="w-4 h-4" />
//                 {format(new Date(latestMetric.date), 'MMM d, yyyy')}
//               </div>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               {latestMetric.weight && (
//                 <div className="text-center p-4 bg-blue-50 rounded-lg">
//                   <div className="text-2xl font-bold text-gray-900">{latestMetric.weight}</div>
//                   <div className="text-sm text-gray-600">{weightUnit}</div>
//                   {bodyMetrics[1]?.weight && (
//                     <div className="mt-1 text-xs flex items-center justify-center gap-1">
//                       {getChange(latestMetric.weight, bodyMetrics[1].weight)?.direction === 'up' && (
//                         <>
//                           <TrendingUp className="w-3 h-3 text-green-600" />
//                           <span className="text-green-600">+{getChange(latestMetric.weight, bodyMetrics[1].weight)?.value.toFixed(1)}</span>
//                         </>
//                       )}
//                       {getChange(latestMetric.weight, bodyMetrics[1].weight)?.direction === 'down' && (
//                         <>
//                           <TrendingDown className="w-3 h-3 text-red-600" />
//                           <span className="text-red-600">-{getChange(latestMetric.weight, bodyMetrics[1].weight)?.value.toFixed(1)}</span>
//                         </>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {latestMetric.bodyFat && (
//                 <div className="text-center p-4 bg-green-50 rounded-lg">
//                   <div className="text-2xl font-bold text-gray-900">{latestMetric.bodyFat}%</div>
//                   <div className="text-sm text-gray-600">Body Fat</div>
//                   {bodyMetrics[1]?.bodyFat && (
//                     <div className="mt-1 text-xs flex items-center justify-center gap-1">
//                       {getChange(latestMetric.bodyFat, bodyMetrics[1].bodyFat)?.direction === 'down' && (
//                         <>
//                           <TrendingDown className="w-3 h-3 text-green-600" />
//                           <span className="text-green-600">-{getChange(latestMetric.bodyFat, bodyMetrics[1].bodyFat)?.value.toFixed(1)}%</span>
//                         </>
//                       )}
//                       {getChange(latestMetric.bodyFat, bodyMetrics[1].bodyFat)?.direction === 'up' && (
//                         <>
//                           <TrendingUp className="w-3 h-3 text-red-600" />
//                           <span className="text-red-600">+{getChange(latestMetric.bodyFat, bodyMetrics[1].bodyFat)?.value.toFixed(1)}%</span>
//                         </>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {latestMetric.measurements && (
//               <div className="mt-6">
//                 <h3 className="font-semibold text-gray-900 mb-3">Body Measurements ({measurementUnit})</h3>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                   {Object.entries(latestMetric.measurements).map(([key, value]) => {
//                     if (!value) return null;
//                     const change = getMeasurementChange(key as keyof NonNullable<BodyMetrics['measurements']>);
//                     const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

//                     return (
//                       <div key={key} className="p-3 bg-gray-50 rounded-lg">
//                         <div className="text-sm text-gray-600">{label}</div>
//                         <div className="flex items-center gap-2">
//                           <div className="text-lg font-semibold text-gray-900">{value}</div>
//                           {change && change.direction !== 'same' && (
//                             <span className={`text-xs flex items-center gap-0.5 ${
//                               change.direction === 'up' ? 'text-green-600' : 'text-blue-600'
//                             }`}>
//                               {change.direction === 'up' ? (
//                                 <TrendingUp className="w-3 h-3" />
//                               ) : (
//                                 <TrendingDown className="w-3 h-3" />
//                               )}
//                               {change.value.toFixed(1)}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* History */}
//         {bodyMetrics.length > 0 ? (
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">Measurement History</h2>
//             <div className="space-y-3">
//               {bodyMetrics.map((metric) => (
//                 <div
//                   key={metric.id}
//                   className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
//                   onClick={() => setSelectedMetric(metric)}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="font-medium text-gray-900">
//                       {format(new Date(metric.date), 'MMM d, yyyy')}
//                     </div>
//                     <div className="flex items-center gap-4 text-sm">
//                       {metric.weight && (
//                         <span className="text-gray-600">
//                           {metric.weight} {weightUnit}
//                         </span>
//                       )}
//                       {metric.bodyFat && (
//                         <span className="text-gray-600">{metric.bodyFat}% BF</span>
//                       )}
//                     </div>
//                   </div>
//                   {metric.notes && (
//                     <p className="text-sm text-gray-600 mt-2">{metric.notes}</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl shadow-sm p-12 text-center">
//             <div className="max-w-md mx-auto">
//               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <TrendingUp className="w-8 h-8 text-blue-600" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-2">No Measurements Yet</h3>
//               <p className="text-gray-600 mb-6">
//                 Start tracking your body measurements to monitor your progress over time.
//               </p>
//               <button
//                 onClick={() => setShowAddForm(true)}
//                 className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//               >
//                 Add First Entry
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BodyMeasurements;
