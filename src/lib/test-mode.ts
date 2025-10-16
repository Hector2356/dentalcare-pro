'use client';

interface TestModeConfig {
  enabled: boolean;
  database: 'test' | 'main';
  autoCleanup: boolean;
  cleanupInterval: number; // minutes
  showIndicator: boolean;
  testDataPrefix: string;
}

class TestModeManager {
  private config: TestModeConfig;
  private cleanupTimer: NodeJS.Timeout | null = null;
  private readonly STORAGE_KEY = 'test-mode-config';

  constructor() {
    this.config = this.loadConfig();
    this.initializeTestMode();
  }

  private loadConfig(): TestModeConfig {
    if (typeof window === 'undefined') {
      return this.getDefaultConfig();
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return { ...this.getDefaultConfig(), ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Error loading test mode config:', error);
    }

    return this.getDefaultConfig();
  }

  private getDefaultConfig(): TestModeConfig {
    return {
      enabled: false,
      database: 'test',
      autoCleanup: true,
      cleanupInterval: 30, // 30 minutes
      showIndicator: true,
      testDataPrefix: 'TEST_',
    };
  }

  private saveConfig(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.config));
      } catch (error) {
        console.error('Error saving test mode config:', error);
      }
    }
  }

  private initializeTestMode(): void {
    if (this.config.enabled && this.config.autoCleanup) {
      this.startCleanupTimer();
    }

    // Add test mode class to body for styling
    if (typeof document !== 'undefined') {
      if (this.config.enabled) {
        document.body.classList.add('test-mode');
      } else {
        document.body.classList.remove('test-mode');
      }
    }
  }

  private startCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanupTestData();
    }, this.config.cleanupInterval * 60 * 1000);
  }

  private stopCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  // Public API
  enableTestMode(): void {
    this.config.enabled = true;
    this.saveConfig();
    this.initializeTestMode();
    console.log('🧪 Test mode enabled');
  }

  disableTestMode(): void {
    this.config.enabled = false;
    this.stopCleanupTimer();
    this.saveConfig();
    this.initializeTestMode();
    console.log('🚫 Test mode disabled');
  }

  toggleTestMode(): void {
    if (this.config.enabled) {
      this.disableTestMode();
    } else {
      this.enableTestMode();
    }
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  getConfig(): TestModeConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<TestModeConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
    this.initializeTestMode();
  }

  // Test data management
  generateTestId(originalId: string): string {
    return `${this.config.testDataPrefix}${originalId}_${Date.now()}`;
  }

  isTestData(id: string): boolean {
    return id.startsWith(this.config.testDataPrefix);
  }

  async cleanupTestData(): Promise<void> {
    if (!this.config.enabled) return;

    console.log('🧹 Cleaning up test data...');
    
    try {
      // This would connect to the test database and clean up old test data
      const response = await fetch('/api/test/cleanup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          olderThan: this.config.cleanupInterval, // minutes
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Cleaned up ${result.deletedCount} test records`);
      }
    } catch (error) {
      console.error('❌ Error cleaning up test data:', error);
    }
  }

  // Test data generators
  generateTestUser(baseData: any) {
    return {
      ...baseData,
      id: this.generateTestId(baseData.id || 'user'),
      email: `${this.config.testDataPrefix}${baseData.email}`,
      identification: `${this.config.testDataPrefix}${baseData.identification}`,
      name: `[TEST] ${baseData.name}`,
      createdAt: new Date().toISOString(),
    };
  }

  generateTestAppointment(baseData: any) {
    return {
      ...baseData,
      id: this.generateTestId(baseData.id || 'appointment'),
      notes: `[TEST] ${baseData.notes || ''}`,
      createdAt: new Date().toISOString(),
    };
  }

  // Environment detection
  isTestEnvironment(): boolean {
    return this.config.enabled || 
           (typeof window !== 'undefined' && window.location.hostname === 'localhost') ||
           process.env.NODE_ENV === 'development';
  }

  // API wrapper for test mode
  wrapApiCall(originalCall: (...args: any[]) => any, ...args: any[]) {
    if (!this.config.enabled) {
      return originalCall(...args);
    }

    console.log('🧪 [TEST MODE] API Call:', originalCall.name, args);
    
    // Add test headers or modify data as needed
    const result = originalCall(...args);
    
    // Log results for debugging
    if (result instanceof Promise) {
      return result.then(
        (res) => {
          console.log('✅ [TEST MODE] API Success:', res);
          return res;
        },
        (err) => {
          console.log('❌ [TEST MODE] API Error:', err);
          throw err;
        }
      );
    }

    return result;
  }
}

// Singleton instance
export const testMode = new TestModeManager();

// React hook
export function useTestMode() {
  return {
    isEnabled: testMode.isEnabled(),
    config: testMode.getConfig(),
    enable: () => testMode.enableTestMode(),
    disable: () => testMode.disableTestMode(),
    toggle: () => testMode.toggleTestMode(),
    updateConfig: (updates: Partial<TestModeConfig>) => testMode.updateConfig(updates),
    cleanup: () => testMode.cleanupTestData(),
    generateTestId: (id: string) => testMode.generateTestId(id),
    isTestData: (id: string) => testMode.isTestData(id),
    generateTestUser: (data: any) => testMode.generateTestUser(data),
    generateTestAppointment: (data: any) => testMode.generateTestAppointment(data),
  };
}