import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'

const Add = () => {
  const { currentUser } = useSelector(state => state.user)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'web-development',
    price: '',
    coverImage: '',
    deliveryTime: '',
    revisions: '',
    features: []
  })

  const [feature, setFeature] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const data = new FormData()
    data.append('image', file)

    try {
      const res = await axios.post('https://skillbridge-production-cfdd.up.railway.app/api/upload', data)
      setFormData(prev => ({ ...prev, coverImage: res.data.url }))
    } catch (error) {
      console.log(error)
    }
    setUploading(false)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const addFeature = () => {
    if (feature.trim()) {
      setFormData({ ...formData, features: [...formData.features, feature] })
      setFeature('')
    }
  }

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('https://skillbridge-production-cfdd.up.railway.app/api/gigs', formData, {
        withCredentials: true
      })
      navigate('/gigs')
    } catch (error) {
      console.log(error)
    }
  }

  if (!currentUser?.isSeller) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700">Only sellers can add gigs!</h2>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-10 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Create a New Gig</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gig Title</label>
          <input
            name="title"
            type="text"
            placeholder="I will build your React website"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            name="category"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-500"
          >
            <option value="web-development">Web Development</option>
            <option value="design">Design & Creative</option>
            <option value="marketing">Digital Marketing</option>
            <option value="writing">Writing & Translation</option>
            <option value="video">Video & Animation</option>
            <option value="ai">AI Services</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            placeholder="Describe your service in detail..."
            onChange={handleChange}
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
            <input
              name="price"
              type="number"
              placeholder="50"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time (days)</label>
            <input
              name="deliveryTime"
              type="number"
              placeholder="3"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Revisions</label>
          <input
            name="revisions"
            type="number"
            placeholder="2"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-500"
          />
        </div>

        {/* Cover Image */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>

  <div className="flex gap-2 mb-3">
    <input
      name="coverImage"
      type="text"
      placeholder="Paste image URL..."
      value={formData.coverImage}
      onChange={handleChange}
      className="flex-1 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-500"
    />

    <label className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 cursor-pointer font-medium whitespace-nowrap">
      {uploading ? 'Uploading...' : '📤 Upload'}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </label>
  </div>

  {formData.coverImage && (
    <img src={formData.coverImage} alt="preview" className="w-40 h-24 object-cover rounded-lg" />
  )}
</div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Add a feature..."
              value={feature}
              onChange={(e) => setFeature(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-500"
            />
            <button
              type="button"
              onClick={addFeature}
              className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.features.map((f, i) => (
              <span
                key={i}
                className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {f}
                <button
                  type="button"
                  onClick={() => removeFeature(i)}
                  className="text-green-500 hover:text-red-500 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-lg"
        >
          Create Gig
        </button>

      </form>
    </div>
  )
}

export default Add