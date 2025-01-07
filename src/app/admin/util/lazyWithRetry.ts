import { lazy } from 'react';

const lazyWithRetry = (componentImport: any) =>
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.localStorage.getItem('page-has-been-force-refreshed') || 'false'
    );
    try {
      const component = await componentImport();
      window.localStorage.setItem('page-has-been-force-refreshed','false');
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        window.localStorage.setItem('page-has-been-force-refreshed','true');
        return window.location.reload();
      }
      console.log(error);
      throw error;
    }
});

export default lazyWithRetry;