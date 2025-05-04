from typing import List, Dict, Any, Optional
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from .models import Transaction, FinancialMetrics

class FinancialAnalytics:
    def __init__(self, transactions: List[Transaction], btc_price: Optional[float] = None):
        self.transactions = transactions
        self.btc_price = btc_price
        self.df = self._create_dataframe()
        
    def _create_dataframe(self) -> pd.DataFrame:
        """Convert transactions to pandas DataFrame for analysis"""
        data = [{
            'timestamp': tx.timestamp,
            'amount': tx.amount,
            'address': tx.address,
            'value': tx.value,
            'time': tx.time
        } for tx in self.transactions]
        return pd.DataFrame(data)
    
    def calculate_metrics(self) -> FinancialMetrics:
        """Calculate comprehensive financial metrics"""
        return FinancialMetrics(
            total_balance=self._calculate_balance(),
            transaction_stats=self._calculate_transaction_stats(),
            recent_activity=self._calculate_recent_activity(),
            donation_distribution=self._calculate_distribution(),
            growth=self._calculate_growth(),
            predictions=self._generate_predictions(),
            trends=self._analyze_trends(),
            insights=self._generate_insights()
        )
    
    def _calculate_balance(self) -> Dict[str, float]:
        """Calculate total balance in BTC and USD"""
        total_btc = self.df['amount'].sum() / 100000000
        return {
            'btc': total_btc,
            'usd': total_btc * self.btc_price if self.btc_price else None
        }
    
    def _calculate_transaction_stats(self) -> Dict[str, Any]:
        """Calculate transaction statistics"""
        unique_donors = self.df['address'].nunique()
        total_volume = self.df['amount'].sum()
        return {
            'total_count': len(self.df),
            'unique_donors': unique_donors,
            'average_donation': total_volume / len(self.df) if len(self.df) > 0 else 0,
            'average_per_donor': total_volume / unique_donors if unique_donors > 0 else 0,
            'total_volume': total_volume
        }
    
    def _calculate_recent_activity(self) -> Dict[str, Dict[str, Any]]:
        """Calculate activity metrics for different time periods"""
        now = datetime.now()
        periods = {
            'thirty_days': now - timedelta(days=30),
            'seven_days': now - timedelta(days=7),
            'twenty_four_hours': now - timedelta(hours=24)
        }
        
        activity = {}
        for period_name, cutoff in periods.items():
            recent_txs = self.df[self.df['timestamp'] > cutoff.timestamp()]
            activity[period_name] = {
                'count': len(recent_txs),
                'unique_donors': recent_txs['address'].nunique(),
                'total_amount': recent_txs['amount'].sum(),
                'average_amount': recent_txs['amount'].mean() if len(recent_txs) > 0 else 0
            }
        return activity
    
    def _calculate_distribution(self) -> Dict[str, Any]:
        """Calculate donation distribution statistics"""
        amounts = self.df['amount'].sort_values()
        return {
            'min': amounts.min(),
            'max': amounts.max(),
            'average': amounts.mean(),
            'median': amounts.median(),
            'percentiles': {
                '25th': amounts.quantile(0.25),
                '75th': amounts.quantile(0.75)
            }
        }
    
    def _calculate_growth(self) -> Dict[str, float]:
        """Calculate growth metrics"""
        now = datetime.now()
        current_period = self.df[self.df['timestamp'] > (now - timedelta(days=30)).timestamp()]
        previous_period = self.df[
            (self.df['timestamp'] > (now - timedelta(days=60)).timestamp()) &
            (self.df['timestamp'] <= (now - timedelta(days=30)).timestamp())
        ]
        
        def calculate_growth(current, previous):
            if previous == 0:
                return 0
            return ((current - previous) / previous) * 100
        
        return {
            'donor_growth': calculate_growth(
                current_period['address'].nunique(),
                previous_period['address'].nunique()
            ),
            'volume_growth': calculate_growth(
                current_period['amount'].sum(),
                previous_period['amount'].sum()
            ),
            'average_growth': calculate_growth(
                current_period['amount'].mean(),
                previous_period['amount'].mean()
            )
        }
    
    def _generate_predictions(self) -> Dict[str, Any]:
        """Generate predictions using time series analysis"""
        if len(self.df) < 10:  # Need enough data for predictions
            return None
            
        # Prepare time series data
        daily_data = self.df.set_index('timestamp').resample('D')['amount'].sum()
        
        # Fit exponential smoothing model
        model = ExponentialSmoothing(
            daily_data,
            seasonal_periods=7,
            trend='add',
            seasonal='add'
        ).fit()
        
        # Generate predictions
        forecast = model.forecast(30)  # 30-day forecast
        
        return {
            'next_30_days': {
                'total_volume': float(forecast.sum()),
                'daily_average': float(forecast.mean()),
                'confidence_interval': {
                    'lower': float(forecast.quantile(0.25)),
                    'upper': float(forecast.quantile(0.75))
                }
            }
        }
    
    def _analyze_trends(self) -> Dict[str, Any]:
        """Analyze trends in the data"""
        if len(self.df) < 10:
            return None
            
        # Calculate daily trends
        daily_data = self.df.set_index('timestamp').resample('D')['amount'].sum()
        trend_model = LinearRegression()
        X = np.arange(len(daily_data)).reshape(-1, 1)
        trend_model.fit(X, daily_data)
        
        return {
            'daily_trend': {
                'slope': float(trend_model.coef_[0]),
                'intercept': float(trend_model.intercept_),
                'r_squared': float(trend_model.score(X, daily_data))
            }
        }
    
    def _generate_insights(self) -> List[str]:
        """Generate actionable insights from the data"""
        insights = []
        
        # Analyze donation patterns
        recent_activity = self._calculate_recent_activity()['thirty_days']
        if recent_activity['count'] > 0:
            if recent_activity['count'] > recent_activity['unique_donors'] * 1.5:
                insights.append("Many donors are making multiple donations - consider implementing a recurring donation feature")
            
            if recent_activity['average_amount'] > self._calculate_distribution()['average'] * 1.5:
                insights.append("Recent donations are significantly higher than average - analyze what's driving this success")
        
        # Analyze growth
        growth = self._calculate_growth()
        if growth['donor_growth'] < 0:
            insights.append("Donor base is shrinking - consider implementing new outreach strategies")
        elif growth['donor_growth'] > 20:
            insights.append("Strong donor growth - capitalize on momentum with targeted campaigns")
        
        return insights 