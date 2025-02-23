import React, { useEffect, useState } from "react";

const ChatWidget = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (document.getElementById("tawk-script")) {
      setIsLoaded(true);
      return;
    }

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.id = "tawk-script"; // Ensure script isn't added multiple times
    script.async = true;
    script.src = "https://embed.tawk.to/679378b13a842732607466da/1iic0uu3e";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    script.onload = () => {
      setIsLoaded(true);
      if (window.Tawk_API?.hideWidget) {
        window.Tawk_API.hideWidget();
      }
    };

    document.body.appendChild(script);
  }, []);

  const toggleChat = () => {
    if (!isLoaded || !window.Tawk_API) return;

    if (window.Tawk_API.isChatHidden()) {
      window.Tawk_API.showWidget();
      window.Tawk_API.maximize();
    } else {
      window.Tawk_API.hideWidget();
    }
  };

  return null; // No extra button needed since Tawk.to provides its own UI
};

export default ChatWidget;
