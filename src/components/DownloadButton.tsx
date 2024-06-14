"use client";

const DownloadButton = () => {
  const handleDownload = async () => {
    const response = await fetch("/api/v1/user/download");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  return (
    <button
      onClick={handleDownload}
      className="mb-4 bg-green-500 text-white py-2 px-4 rounded"
    >
      엑셀 다운로드
    </button>
  );
};

export default DownloadButton;
