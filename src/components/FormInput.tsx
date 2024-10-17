import { useState } from "react";
import { IoTrash } from "react-icons/io5";

const CreatePostForm: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [descriptions, setDescriptions] = useState([""]);
  const [itineraries, setItineraries] = useState([
    [{ time: "", details: "" }], // Day 1 starts with one itinerary entry
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024); // 10MB max

    if (validFiles.length + selectedImages.length > 6) {
      alert("You can only upload up to 6 images");
    }

    const newImages = validFiles.slice(0, 6 - selectedImages.length); // Limit to 6 images
    setSelectedImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Handle change for a specific itinerary in a specific day
  const handleItineraryChange = (
    dayIndex: number,
    index: number,
    field: string,
    value: string
  ) => {
    const updatedItineraries = [...itineraries];
    updatedItineraries[dayIndex][index][field] = value;
    setItineraries(updatedItineraries);
  };

  // Add a new itinerary for a specific day
  const handleAddItinerary = (dayIndex: number) => {
    const updatedItineraries = [...itineraries];
    updatedItineraries[dayIndex].push({ time: "", details: "" });
    setItineraries(updatedItineraries);
  };

  // Remove an itinerary from a specific day
  const handleRemoveItinerary = (dayIndex: number, index: number) => {
    const updatedItineraries = [...itineraries];
    updatedItineraries[dayIndex].splice(index, 1);
    setItineraries(updatedItineraries);
  };

  // Add a new day with one empty itinerary
  const handleAddDay = () => {
    setItineraries([...itineraries, [{ time: "", details: "" }]]);
  };

  // Remove an entire day based on dayIndex
  const handleRemoveDay = (dayIndex: number) => {
    const updatedItineraries = [...itineraries];
    updatedItineraries.splice(dayIndex, 1);
    setItineraries(updatedItineraries);
  };

  // Handle change in description input field
  const handleDescriptionChange = (index: number, value: string) => {
    const updatedDescriptions = [...descriptions];
    updatedDescriptions[index] = value;
    setDescriptions(updatedDescriptions);
  };

  // Add a new description field
  const handleAddDescription = () => {
    setDescriptions([...descriptions, ""]);
  };

  // Remove a description field
  const handleRemoveDescription = (index: number) => {
    const updatedDescriptions = [...descriptions];
    updatedDescriptions.splice(index, 1);
    setDescriptions(updatedDescriptions);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    const mappedDescriptions = descriptions.map((description) => ({
      description,
    }));

    const mappedItineraries = itineraries.map((dayItinerary) =>
      dayItinerary.map((item) => ({ time: item.time, details: item.details }))
    );

    formData.append("itinerary", JSON.stringify(mappedItineraries));
    formData.append("description", JSON.stringify(mappedDescriptions));

    try {
      const response = await fetch("/api/create-post", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Post created successfully!");
        // event.currentTarget.reset(); // Reset the form fields
        window.location.href = "/dashboard";
      } else if (response.status === 400) {
        const errorData = await response.json();
        // alert(`Error: ${errorData.message}`);
        console.log("Error submitting form", errorData);
      } else {
        // alert("Error submitting form. Check console for details.");
        console.log("Error submitting form", response.statusText);
      }
    } catch (error) {
      // alert("Error submitting form. Check console for details.");
      console.log("Error submitting form", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="max-w-3xl mx-auto p-6 bg-white rounded-md shadow-md"
      onSubmit={handleSubmit}
      method="POST"
      encType="multipart/form-data"
    >
      <h2 className="text-2xl font-bold mb-4">Create New Post</h2>

      {/* Title */}
      <div className="mb-4">
        <label className="block font-medium text-gray-700" htmlFor="title">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="mt-1 block w-full py-1 px-2 text-sm border border-gray-300 rounded-md"
          placeholder="Post title"
          required
        />
      </div>

      {/* Jenis Trip */}
      <div className="mb-4">
        <label className="block font-medium text-gray-700" htmlFor="jenistrip">
          Jenis Trip
        </label>
        <select
          id="jenistrip"
          name="jenistrip"
          className="mt-1 block w-full py-1 px-2 text-sm border border-gray-300 rounded-md"
          required
        >
          <option value="">-</option>
          <option value="Private Trip">Private Trip</option>
          <option value="Open Trip">Open Trip</option>
        </select>
      </div>

      <div className="flex justify-between gap-2">
        {/* Mepo */}
        <div className="mb-4 w-full">
          <label className="block font-medium text-gray-700" htmlFor="mepo">
            Meeting Point
          </label>
          <input
            type="text"
            id="mepo"
            name="mepo"
            className="mt-1 block w-full py-1 px-2 text-sm border border-gray-300 rounded-md"
            placeholder="Meeting point"
            required
          />
        </div>
      </div>

      {/* Destinasi */}
      <div className="mb-4">
        <label className="block font-medium text-gray-700" htmlFor="destinasi">
          Destinasi
        </label>
        <textarea
          id="destinasi"
          name="destinasi"
          rows={3}
          className="mt-1 block w-full py-1 px-2 text-sm border border-gray-300 rounded-md"
          placeholder="Destinations (comma separated) e.g. Kawah, Pasir Putih"
          required
        />
      </div>

      {/* Fasilitas */}
      <p className="block font-medium text-gray-700">Fasilitas</p>
      <div className="flex sm:flex-nowrap flex-wrap justify-between gap-2">
        {/* Include */}
        <div className="mb-4 w-full">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="start"
          >
            Include
          </label>
          <textarea
            rows={3}
            id="include"
            name="include"
            className="mt-1 block w-full py-1 px-2 text-sm border border-gray-300 rounded-md"
            placeholder="Include (comma separated) e.g. Dokumentasi, Tiket masuk"
            required
          />
        </div>

        {/* Exclude */}
        <div className="mb-4 w-full">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="end"
          >
            Exclude
          </label>
          <textarea
            rows={3}
            id="exclude"
            name="exclude"
            className="mt-1 block w-full py-1 px-2 text-sm border border-gray-300 rounded-md"
            placeholder="Exclude (comma separated) e.g. Tip sopir, Parkir"
            required
          />
        </div>
      </div>

      {/* Prices */}
      <div className="mb-4">
        <label className="block font-medium text-gray-700" htmlFor="prices">
          Prices
        </label>
        <input
          type="text"
          id="prices"
          name="prices"
          className="mt-1 block w-full py-1 px-2 text-sm border border-gray-300 rounded-md"
          placeholder="Prices (comma separated) e.g. 350, 600, 1.000, 2.000"
          required
        />
      </div>

      {/* Photos */}
      <div className="mb-4 w-full">
        <label
          htmlFor="file-upload"
          className="block font-medium leading-6 text-gray-900"
        >
          Photos
        </label>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-300"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                clipRule="evenodd"
              ></path>
            </svg>
            <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600">
              <label
                htmlFor="photos"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span>Upload a file</span>
                <input
                  id="photos"
                  name="photos"
                  type="file"
                  multiple
                  className="sr-only"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-gray-600">
              PNG, JPG, GIF up to 10MB
            </p>
            <div id="selected-images" className="mt-2 grid grid-cols-3 gap-2">
              {selectedImages.map((file, index) => (
                <div key={index} className="relative m-2">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-auto w-48 object-cover"
                  />
                  <button
                    type="button"
                    className="remove-image-btn absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
                    onClick={() => handleRemoveImage(index)}
                    aria-label="Remove Image"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Itinerary */}
      <div className="mb-4">
        <p className="block font-medium text-gray-700">Itinerary</p>

        {itineraries.map((dayItinerary, dayIndex) => (
          <div key={dayIndex}>
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-800 mt-4">
                Day {dayIndex + 1}
              </p>
              {itineraries.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveDay(dayIndex)}
                  className="text-red-700 hover:text-red-700 flex items-center"
                >
                  <IoTrash size={20} />
                  <span className="ml-1 text-sm font-medium">Remove Day</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-5 gap-x-2">
              <div className="col-span-1">
                <p className="text-sm text-gray-700">Time</p>
              </div>
              <div className="col-span-4">
                <p className="text-sm text-gray-700">Details</p>
              </div>
            </div>

            {dayItinerary.map((item, index) => (
              <div key={index} className="grid grid-cols-5 gap-x-2 mt-2">
                <div className="col-span-1">
                  <input
                    type="text"
                    value={item.time}
                    onChange={(e) =>
                      handleItineraryChange(
                        dayIndex,
                        index,
                        "time",
                        e.target.value
                      )
                    }
                    className="block w-full py-1 sm:px-2 px-[6px] text-sm border border-gray-300 rounded-md"
                    placeholder="08.00"
                    required
                  />
                </div>
                <div className="col-span-4 flex gap-x-2">
                  <input
                    type="text"
                    value={item.details}
                    onChange={(e) =>
                      handleItineraryChange(
                        dayIndex,
                        index,
                        "details",
                        e.target.value
                      )
                    }
                    className="w-full py-1 px-2 text-sm border border-gray-300 rounded-md"
                    placeholder="Menuju resto makan siang"
                    required
                  />
                  {dayItinerary.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItinerary(dayIndex, index)}
                      className="text-red-700 hover:text-red-700"
                    >
                      <IoTrash size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddItinerary(dayIndex)}
              className="mt-2 text-sm text-blue-500 hover:text-blue-700"
            >
              + Add Itinerary for Day {dayIndex + 1}
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddDay}
          className="mt-2 text-sm font-bold text-blue-500 hover:text-blue-700"
        >
          + Add Day
        </button>
      </div>

      {/* Deskripsi */}
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block font-medium text-gray-700"
        >
          Deskripsi
        </label>

        {descriptions.map((description, index) => (
          <div key={index} className="flex items-center gap-x-2 mt-2">
            <textarea
              id={`description-${index}`}
              name={`description-${index}`}
              rows={2}
              value={description}
              onChange={(e) => handleDescriptionChange(index, e.target.value)}
              className="block w-full py-1 px-2 text-sm border border-gray-300 rounded-md shadow-sm"
              placeholder={`Lorem ipsum dolor sit amet... ( ${index + 1} )`}
              required
            />
            {descriptions.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveDescription(index)}
                className="text-red-700 hover:text-red-700"
              >
                <IoTrash size={20} />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddDescription}
          className="mt-2 text-sm font-medium text-blue-500 hover:text-blue-700"
        >
          + Add Description
        </button>
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          className={`mt-4 px-4 py-2 w-full bg-indigo-600 text-white rounded-md ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default CreatePostForm;
