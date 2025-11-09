'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Type definition for Star
interface Star {
  id: number
  name: string
  magnitude: number
  distance: number
  spectral_type: string
}

// API base URL
const API_URL = 'http://localhost:8000'

export default function StarsPage() {
  const [stars, setStars] = useState<Star[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    magnitude: '',
    distance: '',
    spectral_type: '',
  })

  // Fetch stars from backend
  const fetchStars = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_URL}/stars`)
      if (!response.ok) {
        throw new Error('Failed to fetch stars')
      }
      const data = await response.json()
      setStars(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Load stars on component mount
  useEffect(() => {
    fetchStars()
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_URL}/stars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          magnitude: parseFloat(formData.magnitude),
          distance: parseFloat(formData.distance),
          spectral_type: formData.spectral_type,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add star')
      }

      // Reset form and refresh stars list
      setFormData({
        name: '',
        magnitude: '',
        distance: '',
        spectral_type: '',
      })
      await fetchStars()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add star')
    }
  }

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-2">Stars Database</h1>
          <p className="text-gray-600">Manage and view astronomical stars data</p>
        </div>

        {/* Add Star Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Star</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Sirius"
              />
            </div>
            <div>
              <label htmlFor="magnitude" className="block text-sm font-medium text-gray-700 mb-1">
                Magnitude
              </label>
              <input
                type="number"
                step="0.01"
                id="magnitude"
                name="magnitude"
                value={formData.magnitude}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., -1.46"
              />
            </div>
            <div>
              <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
                Distance (light-years)
              </label>
              <input
                type="number"
                step="0.01"
                id="distance"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 8.6"
              />
            </div>
            <div>
              <label htmlFor="spectral_type" className="block text-sm font-medium text-gray-700 mb-1">
                Spectral Type
              </label>
              <input
                type="text"
                id="spectral_type"
                name="spectral_type"
                value={formData.spectral_type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., A1V"
              />
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Add Star
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Stars Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Stars List</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading stars...</div>
          ) : stars.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No stars found. Add your first star above!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Magnitude
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Distance (ly)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Spectral Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stars.map((star) => (
                    <tr key={star.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {star.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {star.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {star.magnitude}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {star.distance}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {star.spectral_type}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

